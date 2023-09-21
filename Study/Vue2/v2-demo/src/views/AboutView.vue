<template>
  <div class="about">
    <h1>This is an about page</h1>
    <custom v-model="a" :b.sync="b"></custom>    
    {{ tes }}
    {{ getTime() }}

    {{fullName}}

    <button @click="changeFullName">change fullName</button>
  </div>
</template>
<script>

import custom from './custom.vue';

export default {
    data() {
        return {
            a: 1,
            b: 2,
            firstName: 'jack',
            lastName: 'rose',
        };
    },
    beforeCreate() {
        console.log('父beforeCreate');
    },
    created() {
        console.log('父created');
    },
    beforeMount() {
        console.log('父beforeMount');
    },
    mounted() {
        console.log('父Mounted');
    },
    beforeDestroy() {
        console.log('父beforeDestroy');
    },
    destroyed() {
        console.log('父destroyed');
    },
    components: {
        custom
    },
    computed: {
        tes() {
            return Date.now();
        },
        fullName: {
            get: function() {
                return this.firstName  + '-' + this.lastName;
            },
            set: function(newVal) {
                let name = newVal.split('-');
                this.firstName = name[0];
                this.lastName = name[1];
            }
        }
    },
    methods: {
        getTime() {
            return Date.now();
        },
        changeFullName() {
            this.fullName = 'rose-jack';
        }
    } 
}
</script>
