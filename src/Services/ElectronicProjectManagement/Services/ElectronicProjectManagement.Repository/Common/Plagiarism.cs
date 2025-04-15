using Aspose.Cells;
using DocumentFormat.OpenXml.Packaging;
using Elasticsearch.Net;
using IdentityServer4.Configuration;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using OpenXmLWordprocessing = DocumentFormat.OpenXml.Wordprocessing;
using Aspose.Words;
using System.Reflection.PortableExecutable;
using PdfSharp.Pdf.IO;
using GroupDocs.Viewer;
using GroupDocs.Viewer.Options;

namespace ElectronicProjectManagement.Repository.Common
{
    public class Plagiarism
    {
        public static Double PlagiarismRateCheck = -1;
        public static async Task CompareTwoFileAsync(string baseFilePath, string compareFilePath, List<(List<string>, double, string baseFilePath, string compareFilePath)> SimilarSentences)
        {
            Console.WriteLine($"So sánh file {Path.GetFileName(compareFilePath)} với {Path.GetFileName(baseFilePath)}");

            // Đọc nội dung và tách TOC song song
            var baseSentences = ReadParagraphsFromDocxAsync(baseFilePath).Result;
            var compareSentences = ReadParagraphsFromDocxAsync(compareFilePath).Result;
            var extractBaseTOC = ExtractTOCAsync(baseFilePath).Result;
            var extractTargetTOC = ExtractTOCAsync(compareFilePath).Result;

            // Xóa TOC
            baseSentences.RemoveAll(paragraph => extractBaseTOC.Any(menuItem => paragraph.Contains(menuItem)));
            compareSentences.RemoveAll(paragraph => extractTargetTOC.Any(menuItem => paragraph.Contains(menuItem)));

            // Tách câu và lọc trên thread riêng biệt bằng Task.Run
            var processBaseSentenceTask = Task.Run(() => ProcessText(baseSentences));
            var processCompareSentencesTask = Task.Run(() => ProcessText(compareSentences));

            // Chạy xử lý song song và đợi kết quả
            //await Task.WhenAll(processBaseSentenceTask, processCompareSentencesTask);

            baseSentences = processBaseSentenceTask.Result;
            compareSentences = processCompareSentencesTask.Result;

            // Tìm các câu tương đồng và tính tỉ lệ
            var commonSentences = GetCommonSentencesAsync(baseSentences, compareSentences).Result;
            double similarity = CalculateSimilarity(baseSentences, commonSentences);

            
            SimilarSentences.Add((commonSentences.ToList(), similarity, baseFilePath, compareFilePath));
        }

        static List<string> ProcessText(List<string> sentences)
        {

            sentences = SplitParagraphsIntoSentences(sentences);
            return sentences
                .Where(paragraph => !string.IsNullOrWhiteSpace(paragraph)) // Loại bỏ đoạn trống
                .Where(paragraph => paragraph.Length > 10) // Chỉ giữ đoạn dài hơn 4 ký tự
                .Where(paragraph => paragraph.Any(char.IsLetterOrDigit)) // Loại bỏ đoạn không có chữ cái hoặc số
                .ToList(); ;
        }
        // Lấy text
        public static Task<List<string>> ReadParagraphsFromDocxAsync(string filepath)
        {
            return Task.Run(() =>
            {
                var paragraphList = new List<string>();
                try
                {
                    using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(filepath, false))
                    {
                        var body = wordDocument.MainDocumentPart.Document.Body;
                        foreach (var paragraph in body.Elements<OpenXmLWordprocessing.Paragraph>())
                        {
                            string paragraphText = paragraph.InnerText.Trim();
                            if (!string.IsNullOrEmpty(paragraphText))
                            {
                                paragraphList.Add(paragraphText);
                            }
                        }
                    }
                    if (paragraphList.Count > 0)
                    {
                        paragraphList.RemoveAt(0);
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return paragraphList;
            });
        }

        // Tách câu
        public static List<string> SplitParagraphsIntoSentences(List<string> paragraphs)
        {
            var sentenceBag = new ConcurrentBag<string>();

            // Sử dụng Parallel.ForEach để xử lý song song
            Parallel.ForEach(paragraphs, paragraph =>
            {
                // Tách đoạn văn thành các câu, dựa trên dấu chấm, dấu hỏi, hoặc dấu chấm than
                string[] sentences = Regex.Split(paragraph, @"(?<=[.?!])\s+");

                foreach (string sentence in sentences)
                {
                    if (!string.IsNullOrEmpty(sentence))
                    {
                        sentenceBag.Add(sentence.Trim());
                    }
                }
            });

            // Chuyển đổi ConcurrentBag thành List để trả về
            return sentenceBag.ToList();
        }

        // Lấy TOC
        static Task<List<string>> ExtractTOCAsync(string filePath)
        {
            return Task.Run(() =>
            {
                List<string> tocItems = new();

                // Tải tài liệu
                Document doc = new Document(filePath);
                int currentPage = 1; // Biến đếm trang hiện tại
                bool foundTOC = false;  // Đánh dấu đã bắt đầu quét mục lục

                // Lặp qua tất cả các node trong tài liệu
                foreach (Aspose.Words.Node node in doc.GetChildNodes(NodeType.Paragraph, true))
                {
                    Paragraph paragraph = (Paragraph)node;
                    // Bỏ qua 2 trang bìa
                    if (currentPage <= 2)
                    {
                        currentPage++;
                        continue;
                    }

                    // Kiểm tra nếu đoạn văn có chứa Hyperlink
                    if (paragraph.Runs.Count > 0 && paragraph.GetText().Contains("HYPERLINK"))
                    {
                        foundTOC = true; // Đã tìm thấy menu
                                         // Trích xuất tên mục
                        string itemName = paragraph.ToString(Aspose.Words.SaveFormat.Text);
                        itemName = itemName.Replace("HYPERLINK", "").Trim(); // Xóa "HYPERLINK"

                        // Chỉ lấy nội dung không có số trang
                        int lastTabIndex = itemName.LastIndexOf('\t');
                        if (lastTabIndex > -1)
                        {
                            string content = itemName.Substring(0, lastTabIndex).Trim(); // Nội dung mục
                            tocItems.Add(content);
                        }
                    }
                    else if (foundTOC)
                    {
                        // Dừng vòng lặp nếu đã tìm thấy menu và gặp đoạn không chứa "HYPERLINK"
                        break;
                    }
                }
                return tocItems;
            });
        }

        static double CalculateJaccardSimilarity(IEnumerable<string> shingles1, IEnumerable<string> shingles2)
        {
            var set1 = new HashSet<string>(shingles1);
            var set2 = new HashSet<string>(shingles2);

            // Tính số lượng shingle chung
            var intersectionCount = set1.Intersect(set2).Count();
            // Tính số lượng shingle duy nhất
            var unionCount = set1.Union(set2).Count();

            // Tính toán độ tương đồng Jaccard
            return unionCount == 0 ? 0 : (double)intersectionCount / unionCount; // Tránh chia cho 0
        }

        static IEnumerable<string> GetShingles(string sentence, int shingleSize)
        {
            for (int i = 0; i < sentence.Length - shingleSize + 1; i++)
            {
                yield return sentence.Substring(i, shingleSize);
            }
        }

        static async Task<IEnumerable<string>> GetCommonSentencesAsync(IEnumerable<string> sentences1, IEnumerable<string> sentences2)
        {
            var commonSentences = new ConcurrentBag<string>();

            // Tạo trước shingles cho sentences2
            var sentence2Shingles = sentences2
                .Select(sentence => new
                {
                    Shingles = new HashSet<string>(GetShingles(sentence, 3))
                })
                .ToList();
            // Xử lý từng câu trong sentences1 song song
            await Task.Run(() =>
            {
                Parallel.ForEach(sentences1, sentence1 =>
                {
                    var shingles1 = new HashSet<string>(GetShingles(sentence1, 3)); // Tạo shingles cho câu hiện tại

                    foreach (var item in sentence2Shingles)
                    {
                        // Tính độ tương đồng Jaccard giữa hai tập shingles
                        double similarity = CalculateJaccardSimilarity(shingles1, item.Shingles);

                        // Ngưỡng tương đồng
                        if (similarity > 0.5)
                        {
                            commonSentences.Add(sentence1.Trim());
                            break; // Dừng kiểm tra khi tìm thấy câu phù hợp
                        }
                    }
                });
            });

            return commonSentences;
        }

        static double CalculateSimilarity(IEnumerable<string> baseSentences, IEnumerable<string> commonSentences)
        {
            // Tính toán tỷ lệ tương đồng
            return (double)commonSentences.Count() / baseSentences.Count();
        }

        public static int GetPageCountAsync(string filepath)
        {
            //using (var pdf = PdfReader.Open(filepath, PdfDocumentOpenMode.ReadOnly))
            //{
            //    return pdf.PageCount;
            //}
            using (var viewer = new Viewer(filepath))
            {
                ViewInfoOptions viewInfoOptions = ViewInfoOptions.ForPngView();
                var viewInfo = viewer.GetViewInfo(viewInfoOptions);
                return viewInfo.Pages.Count;
            }
        }
    }
}
