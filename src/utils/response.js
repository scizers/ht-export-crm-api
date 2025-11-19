import fs from "fs";
import async from 'async';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export function success(res, data = {}, status = 200) {
    return res.status(status).json({success: true, data});
}

export function error(res, message = 'Internal Server Error', code = 500) {
    return res.status(code).json({success: false, message});
}

export const successObj = {
    success: true,
    error: false,
};

export const errorObj = {
    success: false,
    error: true,
};
export const handleMediaUpload = (data) => {
    return new Promise((resolve) => {
        let body = _.clone(data);

        async.forEachOf(
            body, (item, key, done) => {
                if (_.isArray(item)) {
                    let kk = [];
                    async.each(
                        item,
                        (file, next) => {
                            let x = file.originFileObj;
                            if (x !== undefined) {
                                let filename = file.response.files[0].filename;

                                kk.push({
                                    uid:  uuidv4(),
                                    name: file.name,
                                    path: `./public/${data?.folderName}/${filename}`,
                                    url: `/${data?.folderName}/${filename}`,
                                });

                                fs.rename(
                                    `./public/${data?.folderName}/${filename}`,
                                    `./public/${data?.folderName}/${filename}`,
                                    (err) => {
                                        if (err) console.log(err);
                                        next();
                                    },
                                );
                            } else {
                                kk.push(file);
                                next();
                            }
                        },
                        () => {
                            body[key] = kk;
                            done();
                        },
                    );
                } else {
                    done();
                }
            },
            () => {
                resolve(body);
            },
        );
    });
};
