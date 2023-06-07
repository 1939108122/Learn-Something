import watermark from '@hi/watermark';

/**
 * 添加全局水印
 * @param customerUserId
 */
 export const setGlobalWatermark = (name, email) => {
    try {
        let pnode = document.querySelector('body');

        new Promise((resolve) => {
            if (pnode) {
                resolve();
            }
        }).then(() => {
            // 暗水印
            try {
                const watermarkConfig = {
                    text: [`${new Date().toDateString()}`, `${name || ''}-${email}`],
                    lineHeight: [25, 12],
                    fontSize: [25, 12],
                    rotate: 0,
                    opacity: 0.005,
                    fontColor: 'red',
                    date: false,
                    paddingWidth: 5,
                    paddingHeight: 0,
                    wrapRotate: 5,
                    wrapTop: '-100px',
                    wrapBottom: '-100px',
                    wrapLeft: '-100px'
                };

                const wtmk = new watermark(watermarkConfig);
                wtmk.show();

            } catch (error) {
                //
                console.log(error);
            }
        });
    } catch (e) {
        // console.log(e);
    }
};