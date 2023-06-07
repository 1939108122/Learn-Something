<script>
export default {
    name: 'emailTags',
    props: {
        value: {
            type: Array
        },
        // 技能标签列表
        skillTags: {
            type: Array,
            default: () => ([])
        },
        // 最大选取上限
        limit: {
            type: Number,
            default: 3
        }
    },
    data () {
        return {
            selected: [],
            addedTags: [],
            query: ''
        };
    },
    computed: {
        // 系统数据 + 自定义技能标签
        resultSkillTags (newI) {
            return this.skillTags.concat(this.addedTags);
        }
    },
    created () {
        this.initSelected();
        this.$emit('on-open');
    },
    methods: {
        initSelected () {
            this.selected = this.value.slice();
        },
        handleChange (data) {
            if(data.length > this.limit){
                this.$toast({
                    content: `最多可选择${this.limit}个技能标签`,
                    type: 'error'
                });
                this.selected = data.slice(0, this.limit);
            }
            this.$emit('input', this.selected);
        },
        handleKeyUp (query) {
            // console.log('resultSkillTags', this.resultSkillTags);
            /* 检验是否是邮箱格式 */
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if(!myreg.test(query) && query)
            {
                this.$toast({
                    content: '请输入有效的邮箱',
                    type: 'error'
                });
                return false;
            }
            if(query.length>80)
            {
                this.$toast({
                    content: '请输入有效的邮箱',
                    type: 'error'
                });
                return false;
            }
            /* 检查邮箱后缀是否是以@kanzhun.com结尾的 */
            if(query.substring(query.indexOf('@') + 1, query.length)!=='kanzhun.com'){
                this.$toast({
                    content: '请输入@kanzhun.com结尾的邮箱',
                    type: 'error'
                });
                return false;
            }
            if(this.resultSkillTags.indexOf(query)!==-1){
                this.$toast({
                    content: '邮箱重复，请检查',
                    type: 'error'
                });
                return false;

            };
         
            if(query !== '' && this.selected.indexOf(query) < 0){
                this.addedTags.push(this.query);
                this.selected.push(this.query);
            }
            this.$refs.skill.query = '';
        }
    }
};
</script>


<template>
    <div class="skill-tag-selecter email-select-tags">
        <ui-select v-model="selected" filterable multiple ref="skill" placeholder='请输入，回车添加标签'
            @on-change="handleChange" @on-enter="handleKeyUp" @on-query-change="query = $event">
            <ui-option v-for="(item, idx) in resultSkillTags" :value="item" :label="item" :key="idx">
                <span :class="{'active': selected.indexOf(item) > -1 }">{{ item }}</span>
            </ui-option>
            <div class="tip-box" slot="data-blank">
                <span>回车添加标签</span>
                <i class="h">{{ query }}</i>
            </div>
        </ui-select>
    </div>
</template>
<style lang="less">
      .email-select-tags  .ui-select-input{
            min-width: 400px;
            max-width: 100%;
        }
</style>