import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './index.css';
import { Tree } from 'antd';
const { TreeNode } = Tree;
class ListPermissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
      permissionsTree: [],
    };
  }

  loadPermissionTreeToCheck = () => {
    let checkedKeys = [];
    const { permissions } = this.props;
    // console.log(permissions);
    const permissionsTree = permissions.map(
      ({ groupPermissionId, groupPermissionName, permission, isActive }) => {
        if (isActive > 0) {
          checkedKeys.push('group-' + groupPermissionId);
        }

        return {
          key: `group-${groupPermissionId}`,
          title: groupPermissionName,
          children: permission.map((permis) => {
            if (permis.isActive > 0) {
              checkedKeys.push('' + permis.id);
            }
            return {
              key: '' + permis.id,
              title: permis.permissionName,
            };
          }),
        };
      }
    );
    this.setState({ permissionsTree, checkedKeys });
  };

  componentDidMount() {
    this.loadPermissionTreeToCheck();
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  onSubmitPermission = () => {
    const { onSubmitPermission, permissions } = this.props;
    const { checkedKeys } = this.state;
    let newPermissions = permissions.map((group) => ({
      ...group,
      isActive: checkedKeys.includes('group-' + group.groupPermissionId)
        ? 1
        : 0,
      permission: group.permission.map((ele) => ({
        ...ele,
        isActive: checkedKeys.includes('' + ele.id) ? 1 : 0,
      })),
    }));
    onSubmitPermission(newPermissions);
  };

  onCancel = () => {
    this.loadPermissionTreeToCheck();
  };

  renderTreeNodes = (data) => {
    if (data && data.length)
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      });
    return [];
  };

  render() {
    const { checkedKeys, permissionsTree } = this.state;
    // console.log('permissions', permissionsTree);

    return (
      <div className="list-permissions">
        <button
          type="button"
          className="btn btn-default btn-sm"
          data-toggle="modal"
          data-target="#modalListPermissions">
          <FontAwesomeIcon icon="cog" />
        </button>
        <div id="modalListPermissions" className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header px-4">
                <h5 className="modal-title">Set Permissions</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body px-4">
                <Tree
                  checkable
                  onCheck={this.onCheck}
                  checkedKeys={checkedKeys}>
                  {this.renderTreeNodes(permissionsTree)}
                </Tree>
              </div>
              <div className="modal-footer px-4">
                <button
                  type="submit"
                  className="btn btn-orange"
                  data-dismiss="modal"
                  onClick={this.onSubmitPermission}>
                  Save
                </button>
                <button
                  type="reset"
                  className="btn btn-secondary ml-3"
                  data-dismiss="modal"
                  onClick={this.onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListPermissions;
