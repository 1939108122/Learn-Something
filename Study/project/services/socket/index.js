import mqtt from '@/lib/mqtt';
import protobuf from '@/lib/proto';
import Vue from 'vue';
import store from '@/store';
import MD5Util from '@/utils/tools/md5';

export default class MQTT {
    constructor () {
        this.instance = null; // new MQTT()
        this.clinet = null; // mqtt实例
        this.reconnectionsNumber = 0; // 重连次数累加
        this.handlers = {}; //事件集合
    }
    static getInstance () {
        if(!this.instance) {
            this.instance = new MQTT();
        };
        return this.instance;
    }
    connect (userExamId) {

        this.offline();

        //协议类型 http: / https:
        const protocalType = window.location.protocol;
        const wsProtocol = protocalType == 'https:' ? 'wss' : 'ws';

        let baseUrl = 'ks-qa.weizhipin.com';
        if(process.env.DEPLOY_ENV === 'pre') {
            baseUrl = 'pre-ks.zhipin.com';
        } 
        else if(process.env.DEPLOY_ENV === 'prod') {
            baseUrl = 'ks.zhipin.com';
        };

        const MQTT_URL = `${wsProtocol}://${baseUrl}/kschat`;
        const EXAM_SECRECT = 'SehSVltv80Z2exLs'; //固定密钥
        const userName = store.state.user.userEmail;

        // let clientId = `ws-${Date.now()}`;
        let clientId = `ws-${userExamId}`;

        this.clinet = mqtt.connect(
            MQTT_URL,
            {
                keepalive: 30,
                username: userName,
                password: MD5Util.hex_md5(clientId + userName + EXAM_SECRECT),
                clientId: clientId,
                // 重新连接
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000
            }
        );

        this.clinet.on('connect', this.onConnect.bind(this));
        this.clinet.on('message', this.onMessage.bind(this));

        this.clinet.on('error', this.onError.bind(this));
        this.clinet.on('close', this.onClose.bind(this));
        this.clinet.on('offline', this.onOffline.bind(this));
        this.clinet.on('disconnect', this.onDisconnect.bind(this));
        this.clinet.on('packetsend', this.onPacketsend.bind(this));
        this.clinet.on('reconnect', this.onReconnect.bind(this));

    }
    /**
     * 手动下线
     */
    offline () {
        this.clinet && this.clinet.end();
    }
    /**
     * 发送消息
     * @param topic { String } text、img、dialog、read
     * @param payload
     * @param qos
     * @returns { Promise }
     */
    sendMsg (topic='text', payload, fromUser, toUser, userExamId, qos=1) {

        /**
         * 
        // 消息发送方
        let fromUser = {
            uid: 43749,
            roleType: 1,
        };

        // 消息接收方
        let toUser = {
            uid: 45349,
            roleType: 2,
        };
         * 
         */

        // 判断是否为ArrayBuffer实例
        if(!ArrayBuffer.isView(payload)) {
            switch(topic) {
                case 'text': 
                    payload = protobuf.encodeSendMsgs(payload, fromUser, toUser, userExamId);
                    break;
                default:
                    break;
            };
        };

        return new Promise((resolve, reject) => {
            this.clinet && this.clinet.publish('chat', payload, {qos}, error => {
                if(error) {
                    Vue.prototype.$toast({
                        type: 'error',
                        content: '消息发送失败请重试',
                    });
                    reject(error);
                } else {
                    resolve(protobuf.ZpExamProtocol.decode(payload))
                };
            });
        });

    }
    onConnect () {
        // this.reconnectionsNumber = 0;
    }
    onMessage (topic, message) {
        // console.log(message, 'message');
        switch (topic) {
            case 'chat':
                message = protobuf.ZpExamProtocol.decode(message);
                // broadcast
                if(this.handlers[topic]) {
                    this.handlers[topic].forEach(fc => {
                        fc(message);
                    });
                };
                break;
        };

        console.error({
            topic,
            message,
        });

    }
    onError () {
        console.log(`触发error事件：${new Date()}`);
        this.offline();
    }
    onClose (...args) {
        console.error(`触发close事件：${new Date()}`, args);
    }
    onOffline (...args) {
        console.error(`触发offline事件：${new Date()}`, args);
    }
    onDisconnect () {
        console.error(`触发disconnect事件：${new Date()}`, this.clinet.connected);
    }
    onPacketsend (packet) {
        let {cmd, topic, payload} = packet;
        
        // 心跳
        if(cmd == 'pingreq') {
            return false;
        };

        if(cmd == 'publish' && topic == 'chat') {
            let message = {...protobuf.ZpExamProtocol.decode(payload)};

            if(message.type == 1 && message.messages) {
                // 自己发送消息 目前服务没有回推 需要前端自己处理
                // broadcast
                if(this.handlers['onPacketsend']) {
                    this.handlers['onPacketsend'].forEach(fc => {
                        fc(message);
                    });
                };
            };
        };
    }
    onReconnect (...args) {
        console.log(`触发reconnect事件`, ...args);
    }
    addEventListener (topic, callback) {
        if(!this.handlers[topic]) {
            this.handlers[topic] = [];
        };
        this.handlers[topic].push(callback);
    }
    removeEventListener (topic, callback) {

        if(!topic in this.handlers) {
            return false;
        };

        if(!callback) {
            delete this.handlers[topic];
        }
        else {
            const idx = this.handlers[topic].findIndex(ele => ele === callback);
            if(idx > -1) {
                this.handlers[topic].splice(idx, 1);
                if(this.handlers[topic].length == 0) {
                    delete this.handlers[topic];
                };
            };
        };
    }
};