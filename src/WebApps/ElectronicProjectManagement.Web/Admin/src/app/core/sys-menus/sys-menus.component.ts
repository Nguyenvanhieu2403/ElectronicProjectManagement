import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase, HtMenu, SysMenusService } from 'vnpost-shared';
import { TreeNode, MenuItem } from 'primeng/api';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sysmenus',
  templateUrl: './sys-menus.component.html',
  styleUrls: ['./sys-menus.component.scss']
})
export class SysMenusComponent extends SecondPageEditBase implements OnInit {
  rootTreeNode: TreeNode[] = [
    {
      'label': 'Menu',
      'data': '-1',
      'expandedIcon': 'fa-folder-open',
      'collapsedIcon': 'fa-folder',
      'children': [],
      'type': '1'
    }];
  showAddEdit = false;
  openTreeSearchAdv: boolean;
  openLeftTableSidebar = true;
  rootTreeNodeCount: number;
  selectedTreeNode: TreeNode;
  items: MenuItem[];
  messages = '';
  modelEdit = new HtMenu();
  id = 0;

  arrStatusFilter = [];
  statusSearch = 1;
  idSystem = 1;
  lastSelected: TreeNode;
  arrMenu = [];
  invalid = false;
  constructor(
    private menuService: SysMenusService,
    private _builder: UntypedFormBuilder,
    protected _injector: Injector,

  ) {
    super(menuService, _injector);
    this.formGroup = this._builder.group({
      titleParent: new UntypedFormControl(''),
      code: new UntypedFormControl(''),
      title: new UntypedFormControl('', Validators.compose([Validators.required])),
      url: new UntypedFormControl(''),
      icon: new UntypedFormControl(''),
      orderNo: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
      permissions: new UntypedFormControl('')
    });
    this.items = [
      { label: this._translateService.instant('ContextMenu.addChild'), icon: '__icon ci ci-add', command: (event) => this.addChildNode() },
      { label: this._translateService.instant('ContextMenu.add'), icon: '__icon ci ci-add', command: (event) => this.addFriendNode() },
      { label: this._translateService.instant('ContextMenu.delete'), icon: '__icon ci ci-delete', command: (event) => this.deleteNode() }
    ];
    this.arrStatusFilter = this.arrStatus.slice();
    this.arrStatusFilter.push({ label: this._translateService.instant('STATUS.ALL'), value: 0 },);
  }

  async ngOnInit() {
    this.invalid = this.formGroup.valid;
    this.getTreeView();
  }
  getTreeView() {
    this.modelEdit = new HtMenu();
    this.menuService
      .getTreeMenu(this.idSystem, this.statusSearch)
      .then(rs => {
        if (rs.success) {
          this.rootTreeNodeCount = rs.totalRecord;
          this.messages = rs.message;
          this.rootTreeNode = rs.data;
          this.arrMenu = rs.data;
          // this.rootTreeNode[1].expanded = true;

          this.rootTreeNode.forEach(node => {
            this.expandRecursive(node, true);
          });
        } else {

        }
      });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  nodeSelect(event) {
    this.showAddEdit = true;
    this.selectedTreeNode = event.node;
    this.id = this.selectedTreeNode.data;
    this.menuService.getById(this.id)
      .then(rs => {
        if (rs.success) {
          this.modelEdit = rs.data;
        }
      });
  }

  deleteNode() {
    this._notifierService.showDeleteConfirm().then(rt => {
      this.menuService.delete(this.selectedTreeNode.data)
        .then(rs => {
          if (rs.success) {
            this._notifierService.showDeleteDataSuccess();
            this.modelEdit = new HtMenu();
            this.showAddEdit = false;
            this.getTreeView();
          } else {
            this._notifierService.showDeleteDataError();
          }
        })
        .catch(cath => { });
    });
  }
  addChildNode() {
    this.showAddEdit = true;
    this.modelEdit = new HtMenu();
    this.modelEdit.id = 0;
    if (this.selectedTreeNode !== undefined && this.selectedTreeNode !== null) {
      this.modelEdit.idParent = this.selectedTreeNode.data;
      this.modelEdit.titleParent = this.selectedTreeNode.label;
    }
    this.modelEdit.status = 1;
    this.modelEdit.idSystem = this.idSystem;
    this.modelEdit.orderNo = 0;
  }
  addFriendNode() {
    this.showAddEdit = true;
    this.id = this.selectedTreeNode.data;
    this.menuService.getById(this.id)
      .then(rs => {
        if (rs.success) {
          this.modelEdit = new HtMenu();
          this.modelEdit.id = 0;
          this.modelEdit.idParent = rs.data.idParent;
          this.modelEdit.titleParent = rs.data.titleParent;
          this.modelEdit.status = 1;
          this.modelEdit.idSystem = rs.data.idSystem;
          this.modelEdit.orderNo = 0;
        }
      });
  }
  upNode() {

  }
  downNode() {

  }
  onSave() {
    if (!this.isValid()) {
      return;
    }
    this.modelEdit.idSystem = this.idSystem;
    if (this.modelEdit.id === 0) {
      this.menuService.post(this.modelEdit).then(rs => {
        if (rs.success) {
          this._notifierService.showInsertDataSuccess();
          this.modelEdit = new HtMenu();
          this.getTreeView();
          this.showAddEdit = false;
        } else {
          this._notifierService.showInsertDataFailed();
        }
      });
    } else {
      this.menuService.put(this.modelEdit.id.toString(), this.modelEdit).then(rs => {
        if (rs.success) {
          this._notifierService.showUpdateDataSuccess();
          this.modelEdit = new HtMenu();
          this.getTreeView();
          this.showAddEdit = false;
        } else {
          this._notifierService.showUpdateDataFailed();
        }
      });
    }
  }
  onCancel() {
    this.showAddEdit = false;
    this.modelEdit = new HtMenu();
  }

  private expandParentRecursive(node: TreeNode) {
    if ((node != null || node !== undefined) && (node.parent != null || node.parent !== undefined)) {
      node.parent.expanded = true;
      this.expandParentRecursive(node.parent);
    }
  }
  toggleLeftTableSidebar() {
    this.openLeftTableSidebar = !this.openLeftTableSidebar;
  }
  onNodeDrop(event: any) {
    console.log(event);
    event.accept();
  }

  toggleTreeSearchAdv() {
    this.openTreeSearchAdv = !this.openTreeSearchAdv;
  }

  expandTreeNodes(level: number = 0) {

    this.rootTreeNode.forEach(node => {
      this.expandRecursiveNode(node, true, 1, level);
    });
  }

  private expandRecursiveNode(node: TreeNode, isExpand: boolean, currentLevel: number, expandLevels?: number) {
    if (expandLevels) {
      if (currentLevel > expandLevels) {
        isExpand = false;
      }
    }

    node.expanded = isExpand;

    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursiveNode(childNode, isExpand, currentLevel + 1, expandLevels);
      });
    }
  }
}
