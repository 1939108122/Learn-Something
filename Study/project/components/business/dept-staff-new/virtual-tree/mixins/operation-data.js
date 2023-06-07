import { checkEnum, showEnum, ff } from '../utils/const-variable';

let showIndex = 0;
export const OperationData = {
    props: {
        idKey: { // 主键名
            type: String,
            default: 'id',
        },
        pidKey: { // 父键名
            type: String,
            default: 'pid',
        },
        titleKey: {
            type: String,
            default: 'title',
        },
        itemSize: {
            type: Number,
            default: 36,
        },
    },
    data() {
        return {
            mptt: [],
            listHeight: 0,
        };
    },

    methods: {
        /**
         * @param treeList 平面树数组
         * @param rootId 根结点值
         */
        _convert(treeList, rootId) {
            return new Promise(resolve => {
                let treeMap = new Map();
                this.mptt.splice(0);
                showIndex = 0;
                // 组装成mptt结构
                for (const treeItem of treeList) {
                    const item = {
                        encryptId: treeItem?.encryptId,
                        encryptParentId: treeItem?.encryptParentId,
                        deptName3: treeItem?.deptName3,
                        classCode: treeItem?.classCode || 0,
                        id: treeItem[this.idKey],
                        pid: treeItem[this.pidKey],
                        title: treeItem[this.titleKey],
                        // 可删除的，用于处理动画删除事件
                        // removable: false,
                        // 是否处理模糊查询
                        // isSearch: false,
                        // showId: 0,
                        lNode: 0,
                        rNode: 0,
                        /**
                         * 显示字段，一共三种状态
                         * show: 显示
                         * hidden: 隐藏
                         * closeShow: 显示但处于父级收缩状态所以不显示
                         */
                        // 判断是不是第一层，第一层默认显示
                        show: treeItem[this.pidKey] === rootId
                            ? showEnum.show
                            : showEnum.unshow,
                        top: 0,
                        bottom: 0,
                        /**
                         * 一共三种情况：
                         * check: 选择
                         * half:半选
                         * uncheck: 未选择
                         */
                        checked: checkEnum.uncheck,
                        allChildren: 0,
                        checkedChildren: 0,
                        selected: false,
                        // 是否打开
                        expand: false,
                        // joinType: '',
                        data: treeItem,
                        children: [],
                    };
                    if (!treeMap.has(item.pid)) {
                        treeMap.set(item.pid, []);
                    }
                    treeMap.get(item.pid).push(item);
                }
                this._recursiveAssembly(treeMap, rootId, 0, 1);

                resolve(this.mptt);
            });
        },

        /**
         * 递归组装
         * @param mpttMap 树列表
         * @param pid 要组装的父ID值
         * @param lNode 左节点值
         * @param deep 深度
         */
        _recursiveAssembly(mpttMap, pid, lNode, deep) {
            // 查询出所有pid为rootId的值
            let children = 0;
            if (mpttMap.has(pid)) {
                const filterData = mpttMap.get(pid);
                // 如果有数据就向下查询，没有就返回lNode作为rNode
                for (let i = 0; i < filterData.length; i++) {
                    const item = filterData[i];

                    // 默认展开两层
                    if (deep <= this.defaultExpandDeep) {
                        if (deep <= this.defaultExpandDeep - 1) {
                            item.expand = true;
                        }
                        item.show = showEnum.show;
                    }

                    this._calculatePosition(item);

                    // if (i === 0) {
                    //     item.joinType = joinTypeEnum.start;
                    // } else if (i === filterData.length - 1) {
                    //     item.joinType = joinTypeEnum.end;
                    // } else {
                    //     item.joinType = joinTypeEnum.center;
                    // }
                    // for (let item of filterData) {
                    item.lNode = lNode;
                    item.deep = deep;
                    // item.hole = hole;
                    this.mptt.push(item);
                    // if (item.joinType === joinTypeEnum.end) {
                    //     hole += `[${item.deep}]`;
                    // }

                    let node = this._recursiveAssembly(
                        mpttMap,
                        item.id,
                        lNode + 1,
                        deep + 1,
                    );
                    item.rNode = node.rNode;
                    item.allChildren = node.children;
                    children += node.children + 1;
                    lNode = node.rNode + 1;

                    // 默认展开两层
                    // if (item.deep <= this.defaultExpandDeep) {
                    //     if (item.deep <= this.defaultExpandDeep - 1) {
                    //         item.expand = true;
                    //     }
                    //     item.show = showEnum.show;
                    // }

                    // this._calculatePosition(item);
                }
            }

            return { rNode: lNode, children: children };
        },

        /**
         * 计算出当前项的top和bottom值
         * @param item
         * @private
         */
        _calculatePosition(item) {
            if (item.show === showEnum.show) {
                // item.showId = showIndex;
                item.top = showIndex * this.itemSize;
                item.bottom = (showIndex + 1) * this.itemSize;
                this.listHeight = item.bottom;
                showIndex++;
            }
        },
        // _removeChildren(item) {
        //     for (const treeItem of this.mptt) {
        //         if (treeItem.lNode > item.lNode && treeItem.rNode < item.rNode) {
        //             treeItem.children.splice(0);
        //         }
        //     }
        // },
        /**
         * 获取所有的节点
         */
        getAllNode() {
            return this.mptt;
        },
        /**
         * 获取所有被选中的节点（checkbox和radio都是这样）
         */
        getChecked() {
            return this.mptt.filter((item) => item.checked === checkEnum.check);
        },
        /**
         * 增加节点
         */
        add(node) {
            for (let item of this.mptt) {
                if (item.lNode >= node.lNode) {
                    item.lNode += 2;
                }
                if (item.rNode >= node.lNode) {
                    item.rNode += 2;
                }
            }
            this.mptt.push(node);
        },
        checkAll(check) {
            for (let item of this.mptt) {
                item.checked = check ? checkEnum.check : checkEnum.uncheck;
                item.checkedChildren = check ? item.allChildren : 0;
            }
        },
        /**
         * 选中
         * @param id 要选中的id
         * @param check 是选中还是取消选中
         * @param multi 是不是多选
         * @private
         */
        _check(id, check, multi) {
            let checkNum = 0;
            let checkItem = null;

            // 多选的情况下，要把父极和子级都处理
            if (multi) {
                for (let item of this.mptt) {
                    if (item.id === id) {
                        checkItem = item;
                        item.checked = check ? checkEnum.check : checkEnum.uncheck;
                        item.selected = check;
                        checkNum = check
                            ? item.allChildren - item.checkedChildren + 1
                            : -item.checkedChildren - 1;

                        item.checkedChildren = check ? item.allChildren : 0;
                        break;
                    }
                }

                for (let i = this.mptt.length - 1; i >= 0; i--) {
                    const item = this.mptt[i];
                    // 所有子级正常操作
                    if (item.lNode > checkItem.lNode && item.rNode < checkItem.rNode) {
                        item.checked = check ? checkEnum.check : checkEnum.uncheck;
                        item.checkedChildren = check ? item.allChildren : 0;
                        item.selected = check;
                    }

                    // 所有父级处理
                    if (item.lNode < checkItem.lNode && item.rNode > checkItem.rNode) {
                        item.checkedChildren += checkNum;

                        if (item.checkedChildren === item.allChildren) {
                            // 相同为全选，总数+1
                            item.checked = checkEnum.check;
                            item.selected = true;
                            checkNum++;
                        } else if (item.checkedChildren === 0) {
                            // 为0，就是减少，总数-1
                            item.checked = checkEnum.uncheck;
                            item.selected = false;
                            // checkNum--
                        } else {
                            // 其他情况不变
                            item.checked = checkEnum.half;
                            item.selected = false;
                            /**
                             * 在全选的情况下，取消掉一个子件，实际上数量是 -(n+1)
                             */
                            if (checkNum < 0 && item.allChildren - item.checkedChildren >= 1) {
                                checkNum--;
                            }
                        }
                    }
                }
            }
        },

        /**
         * 选择（select类型）
         * @param id 要选中的id
         * @private
         */
        _select(id) {
            for (let item of this.mptt) {
                if (item.id === id) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            }
        },
        unselect() {
            for (let item of this.mptt) {
                item.selected = false;
            }
        },
        /**
         * 展开/关闭
         * @param id
         * @param lNode 左节点
         * @param rNode 右节点
         * @param expand 展开关闭状态
         * @private
         */
        _expand(id, lNode, rNode, expand) {
            showIndex = 0;
            for (let item of this.mptt) {
                if (item.lNode > lNode && item.rNode < rNode) {
                    if (item.pid === id) {
                        item.show = expand ? showEnum.show : showEnum.unshow;
                        // 解决跨级收起，再展开的问题
                        if (item.expand && item.show === showEnum.show) {
                            this.mptt.forEach(node => {
                                if (node.pid === item.id) {
                                    node.show = showEnum.closeShow;
                                }
                            });
                        }
                    } else {
                        if (!expand) {
                            // 跨级收起 第一次 show -> closeShow，第二次 closeShow -> unshow
                            // 再次展开 unshow 就不展示了，不符合预期。
                            item.show =
                                item.show === showEnum.show
                                    ? showEnum.closeShow
                                    : showEnum.unshow;
                        } else {
                            item.show =
                                item.show === showEnum.closeShow
                                    ? showEnum.show
                                    : showEnum.unshow;
                        }
                    }
                }
                this._calculatePosition(item);
            }
        },
        _getVisibleItems(top, bottom, pid = null) {
            const result = [];
            if (top === bottom) {
                return result;
            }
            for (let item of this.mptt) {
                if (item.show !== showEnum.show) {
                    continue;
                }
                // 当pid不为空而且id==pid,或者pid!=id时不处理
                if (pid !== null && item.id === pid) {
                    continue;
                }
                if (ff(item.top) >= ff(bottom)) {
                    break;
                }
                if (
                    (ff(item.top) < ff(top) && ff(item.bottom) > ff(top)) ||
                    (ff(item.top) >= ff(top) && ff(item.bottom) <= ff(bottom)) ||
                    (item.top < bottom && ff(item.bottom) >= ff(bottom))
                ) {
                    result.push(item);
                }
            }
            return result;
        },
        // resetRemovable() {
        //     for (const item of mptt) {
        //         item.removable = false;
        //     }
        // },
    },
};
