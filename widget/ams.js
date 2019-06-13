///<reference path="node_modules/@types/jquery/index.d.ts"/>
var Act = /** @class */ (function () {
    function Act() {
        this.cnum = 0;
        this.scene = "?scene=a20190509zgx_xian";
        this._scene = "a20190509zgx_xian";
        this.requestUrl = 'http://apps.xinyue.qq.com/App/gamer';
        this.signLok = true;
        this.comMsg = true;
        this.shareStatus = false;
        this.upSts = true;
        var _pp = new Date();
        this.nowTime = _pp.getDate();
        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
            this._platid = 1;
        }
        else {
            this._platid = 0;
        }
    }
    Act.prototype.initRole = function (t) {
        if (t == 'qq') {
            this._area = this._platid ? 1 : 2;
        }
        else {
            this._area = this._platid ? 3 : 4;
        }
    };
    Act.prototype.getToken = function () {
        return new Promise(function (resolve, reject) {
            amsCfg_563401 = { "iActivityId": 223184, "iFlowId": 563401, "_everyRead": true, "fFlowSubmitEnd": function (res) { return resolve(res.sOutValue1); }, "fFlowSubmitFailed": function (res) { alert(res.sMsg); reject(false); } };
            amsSubmit(223184, 563401);
        });
    };
    Act.prototype.callToken = function (callback) {
        amsCfg_563401 = { "iActivityId": 223184, "iFlowId": 563401, "_everyRead": true, "fFlowSubmitEnd": function (res) { return callback(res.sOutValue1); }, "fFlowSubmitFailed": function (res) { alert(res.sMsg); callback(false); } };
        amsSubmit(223184, 563401);
    };
    Act.prototype.requests = function (url, xy_account) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url + "&xy_account=" + encodeURIComponent(xy_account),
                type: "GET",
                dataType: "jsonp",
                success: function (data) { return resolve(data); },
                error: function (data) { return reject(false); }
            });
        });
    };
    Act.prototype.veryParams = function (name, vale) {
        switch (name) {
            case 'mobile':
                var zz = /^1[345789]\d{9}$/;
                return zz.test(vale);
                break;
            default:
                return true;
                break;
        }
        return true;
    };
    Act.prototype.checkParam = function () {
        var s = $('#checkboxname').attr('checked');
        if (!this.signLok) {
            return;
        }
        this.signLok = false;
        var Alert_message = {
            'empty': { user_nick: '姓名不能为空！', mobile: '联系电话不能为空！', partition: '请选择大区', role_name: '请选择角色！', address: '现居地不能为空！' },
            'very': { user_nick: '填写信息有误！', mobile: '联系电话有误！', address: '现居地含有非法字符！' }
        };
        var val = $("#commit").serializeArray();
        for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
            var j = val_1[_i];
            if (j.value == '' || j.value == '0') {
                this.signLok = true;
                alert(Alert_message.empty[j.name]);
                return;
            }
            if (!this.veryParams(j.name, j.value)) {
                this.signLok = true;
                alert(Alert_message.very[j.name]);
                return;
            }
        }
        //game_area
        if (!s) {
            alert('请勾选确认以上资料填写是否正确');
            this.signLok = true;
            return;
        }
        var _params = $("#commit").serialize();
        var _url = this.requestUrl + "/enlistAction" + this.scene + "&c=yxzj&" + _params + "&game_area=" + this._area;
        this.getData(_url, this.signUpResult);
        this.signLok = true;
    };
    Act.prototype.signUpResult = function (ret) {
        if (ret.status == 1) {
            alert('报名成功！');
            $('.js-get-wrap').hide();
            $('.isshare').hide();
            $('.isbaoming').show();
            return;
        }
        alert('网络异常，请稍后重试！');
    };
    Act.prototype.getData = function (str, callback) {
        var _this_1 = this;
        this.getToken().then(function (d) {
            if (d !== false) {
                _this_1.requests(str, d).then(function (f) {
                    return callback(f);
                });
            }
            else {
                alert('获取登录态失效，请刷新后再试！');
            }
        });
    };
    Act.prototype.format = function (arr) {
        var tp = [];
        for (var g in arr) {
            tp.push(encodeURIComponent(g) + "=" + encodeURIComponent(arr[g]));
        }
        tp.push('v=' + Math.floor(Math.random() * 10000 + 500));
        return tp.join('&');
    };
    Act.prototype.getCommitList = function (param) {
        var _url = this.requestUrl + "/getCommitList" + this.scene + "&" + this.format(param);
        this.getData(_url, this.showList);
    };
    Act.prototype.showList = function (_d) {
        if (typeof (_d.data) == 'object') {
            Tool.lok = true;
            var tmp_str = '';
            for (var _i = 0, _a = _d.data; _i < _a.length; _i++) {
                var y = _a[_i];
                tmp_str += "<li>\n                            <div class=\"feedback-img\"><img\n                                    src=\"" + y.icon + "\"></div>\n                            <div class=\"feedback-info\">\n                                <h5 class=\"feedback-name\">" + y.nick + "</h5>\n                                <p class=\"feedback-msg\">" + y.content + "</p>\n\t\t\t\t\t\t\t\t <a href=\"javascript:" + (y.ido == '0' ? 'io.thumbsUp(' + y.id + ')' : '') + ";\" id=\"f_" + y.id + "\" class=\"feedback-action " + (y.ido != '0' ? 'active' : '') + "\"><i class=\"icon-like\"></i><span>" + y.up + "</span></a>\n                            </div>\n                        </li>";
            }
            $('#befe').before(tmp_str);
        }
    };
    Act.prototype.singUpStatus = function () {
        var _url = this.requestUrl + "/isSignUp" + this.scene;
        this.getData(_url, this.showSignInfo);
    };
    Act.prototype.showSignInfo = function (ret) {
        if (ret.data == '1') {
            $('.isshare').hide();
            $('.isbaoming').show();
        }
    };
    Act.prototype.commitMessage = function () {
        if (!this.comMsg) {
            return;
        }
        if (this.cnum > 5) {
            alert('你提交的太频繁了，请稍后再试~');
            return;
        }
        this.comMsg = false;
        var content = $('#feedback').val();
        if (content == '') {
            this.comMsg = true;
            alert('发送内容不能为空！');
            return;
        }
        var _url = this.requestUrl + "/commitMessage" + this.scene + "&content=" + content;
        this.getData(_url, this.messageResult);
        this.comMsg = true;
    };
    Act.prototype.messageResult = function (ret) {
        if (ret.status == '1') {
            $('#feedback').val('');
            $('.js-guess-sure-wrap-message').show();
        }
    };
    Act.prototype.TgBox = function () {
        if (this.nowTime > 16) {
            alert('该报名已结束！');
            return;
        }
        $('.js-get-wrap').show();
    };
    Act.prototype.showSignBox = function () {
        if (!this.shareStatus) {
            alert('请先分享后才能报名哟！');
            return;
        }
        $('.js-get-wrap').show();
        var o = $('#sRoleId').val();
        if (o != '0') {
            return;
        }
        var PartitionStr = '<option value="0">选择大区</option>';
        for (var _i = 0, _a = YXZJServerSelect.STD_DATA; _i < _a.length; _i++) {
            var o_1 = _a[_i];
            if (o_1.c == this._area) {
                PartitionStr += "<option value=\"" + o_1.v + "\">" + o_1.t + "</option>";
            }
        }
        $('#partition').html(PartitionStr);
    };
    Act.prototype.showRoles = function (v) {
        var data = {
            'sPartition': v,
            'sPlatId': this._platid,
            'sArea': this._area
        };
        amsCfg_567079 = { "iActivityId": 223184, "iFlowId": 567079, "sData": data, "_everyRead": true, "fFlowSubmitEnd": function (res) {
                var _list = res.jData.list;
                if (_list.length > 0) {
                    var _str = "<option value=\"" + decodeURI(_list[0].rolename) + "\">" + decodeURI(_list[0].rolename) + "</option>";
                    $('#sRoleId').html(_str);
                    return;
                }
                $('#sRoleId').html(' <option value="0">查无角色！</option>');
            }, "fFlowSubmitFailed": function (res) { $('#sRoleId').html(' <option value="0">查无角色！</option>'); } };
        amsSubmit(223184, 567079);
    };
    Act.prototype.thumbsUp = function (e) {
        if (!this.upSts)
            return;
        this.upSts = false;
        var l = $('#f_' + e);
        var _num = l.find('span').text();
        _num = parseInt(_num) + 1;
        var _url = this.requestUrl + "/thumbsUp" + this.scene + "&cid=" + e;
        this.getData(_url, function (ret) {
            if (ret.status == '1') {
                l.addClass('active').removeAttr('href');
                l.find('span').text(_num);
            }
            else {
                alert('点赞失败，请稍后再试！');
            }
        });
        this.upSts = true;
    };
    //猜想
    Act.prototype.guessGame = function (_this) {
        var _d = {
            'scene': this._scene,
            'mold': _this.rel
        };
        var _t = $('.support-sucess-wrap');
        amsCfg_566774 = { "iActivityId": 223184, "iFlowId": 566774, sData: _d, "_everyRead": true, "fFlowSubmitEnd": function (res) {
                if (res.jData.result == '0') {
                    _t.hide();
                    alert('支持成功！');
                    $('._' + _this.rel).text("\u5DF2\u6709" + res.jData.score + "\u731C\u60F3");
                }
                else {
                    alert('网络繁忙，请稍后再试！');
                }
            }, "fFlowSubmitFailed": function (res) { alert(res.sMsg); } };
        amsSubmit(223184, 566774);
    };
    Act.prototype.outPut = function () {
        amsCfg_567388 = { "iActivityId": 223184, "iFlowId": 567388, "sNeedSubmitPopDiv": true, "fFlowSubmitEnd": function (res) {
                var arr = ['A', 'B', 'C', 'D', 'E'];
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var t = arr_1[_i];
                    $('._' + t).text("\u5DF2\u6709" + res.jData[t] + "\u731C\u60F3");
                }
                if (res.jData.team == 'A') {
                    $('.js-normal').hide();
                    $('.js-sucess').show();
                }
                else if (res.jData.team == 'B') {
                    $('.js-normal').hide();
                    $('.js-fail').show();
                }
                if (res.jData.team != '0') {
                    $('.person-team').hide();
                    $('.teamWins').show();
                    switch (res.jData.team) {
                        case 'A':
                            $('.f_A').show();
                            var cy = res.jData.A;
                            break;
                        case 'B':
                            $('.f_B').show();
                            var cy = res.jData.B;
                            break;
                        case 'C':
                            $('.f_C').show();
                            var cy = res.jData.C;
                            break;
                        case 'D':
                            $('.f_D').show();
                            var cy = res.jData.D;
                            break;
                        case 'E':
                            $('.f_E').show();
                            var cy = res.jData.E;
                            break;
                        default:
                            break;
                    }
                    $('#cytts').text(cy);
                }
            }, "fFlowSubmitFailed": function (res) { alert(res.sMsg); } };
        amsSubmit(223184, 567388);
    };
    Act.prototype.getPackage = function () {
        amsCfg_566915 = {
            'iAMSActivityId': '223184',
            'activityId': '280907',
            'sData': { 'scene': this._scene },
            'sNeedSubmitPopDiv': false,
            '_everyRead': true,
            'onBeginGetGiftEvent': function () { return 0; },
            'onGetGiftFailureEvent': function (callbackObj, failedRet) { alert(callbackObj.sMsg); },
            'onGetGiftSuccessEvent': function (callbackObj) { alert('领取成功！'); return; }
        };
        amsSubmit(223184, 566915);
    };
    return Act;
}());
var io = new Act();
var par = { 'page': 1 };
/*let vv = io.request('commitList');
console.log(vv);*/ 
