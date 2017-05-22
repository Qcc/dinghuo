    if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
    if(data.entity !== null){
        //成功拿到数据
        
    }

    部门管理
{
    "status": 200,
    "errorCode": 0,
    "message": "Success",
    "moreInfo": "",
    "entity": {
        "count": 4,
        "list": [
            {
                "id": 1,
                "name": "jerry",
                "phone": "jerry",
                "email": null,
                "dp": {
                    "id": 1,
                    "name": "管理部",
                    "corp": null
                },
                "disable": 0
            },
            {
                "id": 2,
                "name": "lily",
                "phone": "136",
                "email": null,
                "dp": {
                    "id": 2,
                    "name": "财务部",
                    "corp": null
                },
                "disable": 0
            },
            {
                "id": 3,
                "name": "zhangcj",
                "phone": "136",
                "email": null,
                "dp": {
                    "id": 3,
                    "name": "销售部",
                    "corp": null
                },
                "disable": 0
            },
            {
                "id": 4,
                "name": "chenz",
                "phone": "136",
                "email": null,
                "dp": {
                    "id": 3,
                    "name": "销售部",
                    "corp": null
                },
                "disable": 0
            }
        ]
    }
}