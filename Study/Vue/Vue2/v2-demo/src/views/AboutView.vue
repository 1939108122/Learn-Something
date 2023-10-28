<template>
  <div class="about">
    <h1>This is an about page</h1>
    <custom v-model="a" :b.sync="b" :user="user">
        <template v-slot="slotProps">
          我是  {{ slotProps.user.firstName }}
        </template>
    </custom>    
    {{ tes }}
    {{ getTime() }}

    {{fullName}}

    <button @click="changeFullName">change fullName</button>

    <h1>{{ obj }}</h1>

    <button @click="changeObj">changeObj</button>
    {{arr}}
  </div>
</template>
<script>

import custom from './custom';
import Vue from 'vue';

export default {
    data() {
        return {
            a: 1,
            b: 2,
            firstName: 'jack',
            lastName: 'rose',
            obj: {
                key: 1
            },
            user: {
                firstName: 'jack',
                lastName: 'rose'
            },
            arr: [1, 2, 3, 4]
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
    updated() {
        console.log('父updated');
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
        },
        changeObj() {
            this.arr.length = 3;
            // this.$nextTick
            // this.$route
            delete this.obj.key;
        }
    } 
}
</script>
