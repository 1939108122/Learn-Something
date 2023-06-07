[wiki 链接](https://wiki.kanzhun-inc.com/pages/viewpage.action?pageId=191086342)

> 【注意】业务代码中只负责聚合数据，弹窗触发逻辑放在了 store/modules/global-message.js 中处理

### 消息数据需符合如下格式

```ts
// 消息子项需有一唯一标识字段: uniqueId
type IMessageItem = {
    type: 'knowledge' | 'common';
    uniqueId: string; // 去重用
    required: boolean; // 是否必读
    title: string; // 标题
    content: string; // 内容
    time: string; // 时间字符串

    // 组件初始化时调用
    externalShow?: Function;
    // 点了关闭（必读消息可不传 - 没有关闭按钮）
    externalClose?: Function;
    // 点了查看
    externalView?: Function;
};
```

### 如何聚合数据

```js
this.$store.dispatch('globalMessage/polymerizeMessageData', {
    storeMessageType: 'common', // common-通用消息类型「预留字段，为后续功能扩展使用，可不传」
    messageList: originMessageList
});
```
∏
### Attributes

| 参数                     | 说明                           | 类型     | 可选值              | 默认值 |
| ------------------------ |------------------------------| -------- |------------------| ------ |
| type                     | 消息类型                         | string   | knowledge、common | common |
| required                 | 是否必读                         | boolean  | true / false     | false  |
| title                    | 消息类型                         | string   | -                | ''     |
| content                  | 内容                           | string   | -                | ''     |
| time                     | 消息时间                         | string   | -                | ''     |
| dangerouslyUseHTMLString | 是否渲染 html 文本                 | boolean  | true / false     | false  |
| customClass              | 自定义样式类                       | string   | -                | ''     |
| externalView             | 点击查看                         | Function | -                | 无     |
| externalClose            | 点击叉号 (required=true 时，该参数无用) | Function | -                | 无     |
| externalShow            | 组件初始化时调用                     | Function | -                | 无     |
| duration                 | 点击查看 (required=true 时，该参数无用) | number   | -            ∏   | 4000   |
| showView                 | 点击查看 (required=true 时，该参数无用) | boolean  | true / false     | true   |

### 手动触发消息「一般不需要手动处理」

```js
store.dispatch('globalMessage/triggerGlobalNotify');
```
