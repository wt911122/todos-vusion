import _eventdispatcher from './event';
import _postData from './postData';

var p = {};
/*
  task 结构
  {
    id: number,
    content: string,
    state: active|complete
  }
*/
var _tasks       = [];
var _engineCycle = 500;
/*

*/
var _PENDING = 2;
var _IDLE    = 1;

var _engine_state = _IDLE;
var _engineOB = new _eventdispatcher();


function _addTask(_task){
  if(_engine_state === _IDLE){
    if(Array.isArray(_task)){
      _tasks = _tasks.concat(_task);
    }else{
      _tasks.push(_task);
    }
  }else{
    var _holdon = _addTask.bind(null, _task);
    _holdon.removed = true;
    _engineOB.addEventListener('ok', _holdon);
  }
}

function _engine() {
  if(_tasks.length > 0 && _engine_state === _IDLE){
    //console.log(_tasks.length);
    _engine_state = _PENDING;
    _postData('/api/crud', _tasks)
      .then(data => data.json())
      .then(data => {
        //console.log(data);
        if(data.code === 1){
          _tasks = [];
        }
        _engineOB.dispatchEvent('ok');
        _engine_state = _IDLE;
      })
      .catch(error => {
        // 操作回滚，加入下一轮新请求
        _engineOB.dispatchEvent('ok');
        _engine_state = _IDLE;
      });
  }
  setTimeout(_engine, _engineCycle);
}

function _startEngine(options){
  _engineCycle = (options && options._engineCycle) || _engineCycle;
  _engine();
}

p.addTask = _addTask;
p.startEngine = _startEngine;

function _initialize(){
  return _postData('/api/r', {})
}
p.initialize = _initialize
/*p.default = {
  completeTask: function(task){
    return Object.assign()
  }
}*/
export default p;
