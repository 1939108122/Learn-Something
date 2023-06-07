# select-virtual 虚拟列表选择器

## 基础用法示例:
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';

    const options = Array.from({ length: 1000 }).map((_, idx) => ({
        value: `Option ${idx + 1}`,
        label: `${initials[idx % 10]}${idx}`,
    }));
    export default {
        components: {
            SelectVirtual
        },
        data () {
            return {
                value: '',
                options
            }
        }
    }
</script>

## 远程搜索示例：

#### 输入关键字以从远程服务器中查找数据
#### 为了启用远程搜索，需要将 filterable 和remote 设置为 true，同时传入一个 remote-method。 remote-method 为一个 Function，它会在输入值发生变化时调用，参数为当前输入值。

<select-virtual 
    :options="options" 
    v-model="value" 
    filterable 
    remote
    :remote-method="remoteMethod"
>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';
    export default {
        components: {
            SelectVirtual
        },
        data () {
            return {
                value: '',
                options: []
            }
        },
        methods: {
            remoteMethod (query = '') {
                console.log(query, 'query');
            }
        }
    }
</script>

## 自定义选项的渲染模板示例：
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
    <template slot-scope="{ item }">
        <span style="margin-right: 8px">{{ (item || {}).label || '默认值'}}</span>
        <span style="color: red; font-size: 13px">
            {{ (item || {}).value || '默认值'}}
        </span>
    </template>
</select-virtual>

## 禁用选择器选项
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';

    const options = Array.from({ length: 1000 }).map((_, idx) => ({
        value: `Option ${idx + 1}`,
        label: `${initials[idx % 10]}${idx}`,
        disabled: idx % 10 === 0,
    }));
    export default {
        components: {
            SelectVirtual
        },
        data () {
            return {
                value: '',
                options
            }
        }
    }
</script>

## select-option自定义模板(虚拟列表模式不支持)
示例一：
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
    <select-option label="test" value="1">
        <span style="float: left">babel</span>
        <span style="float: right; color: #8492a6; font-size: 13px">value</span>
    </select-option>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';
    import SelectOption from '@/components/business/virtual-list/option.vue';

    export default {
        components: {
            SelectVirtual,
            SelectOption
        },
        data () {
            return {
                value: '',
                options: []
            }
        }
    }
</script>

示例二：
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
    <select-option value="1">test</select-option>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';
    import SelectOption from '@/components/business/virtual-list/option.vue';

    export default {
        components: {
            SelectVirtual,
            SelectOption
        },
        data () {
            return {
                value: '',
                options: []
            }
        }
    }
</script>

## 分组:备选项进行分组展示示例(虚拟列表模式不支持)
<select-virtual 
    :options="options" 
    v-model="value" 
    placeholder="Please select"
>
     <select-option-group label="test">
        <select-option value="1">test</select-option>
    </select-option-group>
</select-virtual>
<script>
    import SelectVirtual from '@/components/business/virtual-list/select-virtual.vue';
    import SelectOptionGroup from '@/components/business/virtual-list/option-group.vue';
    import SelectOption from '@/components/business/virtual-list/option.vue';

    export default {
        components: {
            SelectVirtual,
            SelectOptionGroup,
            SelectOption
        },
        data () {
            return {
                value: '',
                options: []
            }
        }
    }
</script>



## select-virtual属性

Attribute                |说明             |类型                      |可选值                        |默认值

v-model                  绑定值            string / number /           -                             -
                                          boolean / object

disabled                 是否禁用           boolean                     -                            false

multiple                 是否多选           boolean                     -                            false

size                     输入框尺寸         string                      large/default/small	          default

clearable                是否可以清空选项    boolean                      -                            false

multiple-limit           多选时可被选择的最   number                      -                            0
                         大数目。当被设置为
                         0时,可被选择的数目
                         不设限。

name                     选择器的原生name     string                      -                            -
                         属性

autocomplete             自动完成选择输入      string                      -                            off   

placeholder              默认文字             string                      -                           请选择

filterable               是否可筛选           boolean                     -                            false

no-data-text             当在没有数据时显      string                      -                            暂无数据
                         示的文字，你同时
                         可以使用#empty
                         插槽进行设置。

popper-class             选择器下拉菜单的      string                      -                             -
                         自定义类名

height                   下拉菜单的高度，      number/string               -                             170
                         每一个子选项的高   
                         度是 34px

remote                   是否从服务器搜索      boolean                     -                             false
                         数据    

 remote-method           当输入值发生变化时    function(keyword: string)    -                              -
                         被调用的函数。 其
                         参数是当前输入值。 
                         只有当 filterable 
                         设置为 true 时才
                         会生效。

loading                  远程数据页面加载提示    boolean                    -                             false

collapse-tags-tooltip    当鼠标悬停于折叠标签    boolean                    -                             false
                         的文本时，是否显示所
                         有选中的标签，只有当 
                         collapse-tags 设
                         置为 true 时才会生效
                        
collapse-tags            多选时是否将选中值按    boolean                    -                              false
                         文字的形式展示        
                         
effect                   文字提示（Tooltip）    string                    light/dark                      light
                         的主题，内置dark和
                         light两种


## select-virtual事件

事件名            |说明                        |回调参数

change           选中值发生变化时触发            val，目前的选中值

visible-change   下拉框出现/隐藏时触发           val，出现则为 true，隐藏则为 false

remove-tag       多选模式下移除tag时触发         val，移除的tag值

clear            可清空的单选模式下用户点
                 击清空按钮时触发                -
            
blur             当选择器的输入框失去焦点时触发    (event: FocusEvent)

focus            当选择器的输入框获得焦点时触发    (event: FocusEvent)


## select-virtual插槽

Name             |说明

default          自定义 Option 模板

empty            自定义当选项为空时的内容

prefix           输入框的前缀


