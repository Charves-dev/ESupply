
//*************************************************************************************************
// 디자이너 객체
//*************************************************************************************************
function BTrackManager(canvasID){
  var canvas = document.getElementById(canvasID);
  var rtn = {
    maxSeq          : 0,
    canvasObj       : canvas,
    dc              : canvas.getContext('2d'),
    Groups          : {},
    selGroups       : {},
    curNodeId       : null,
    cursorName      : null,
    isMouseDown     : false,
    mouseButton     : -1,
    firstX          : 0,                                                    // 마우스 다운으로 특정 오브젝트가 선택되면 그 오브젝트를 제대로
    firstY          : 0,
    grid            : 20,
    gridColor       : '#dcdcdc',
    gridLineWidth   : 0.5,
    snap            : 20,
    resizeMouseGap  : 4,
    openBiEditPop   : null,

    tables          : {},
    selTables       : {},
    Rellys          : {},
    selRellys       : {},

    rellyStep       : 0,
    rellyStartTable : null,
    rellyEndTable   : null,
    vRellySX        : null,
    vRellySY        : null,
    vRellyEX        : null,
    vRellyEY        : null,

    img             : new Image(),

    rellyStart : function() {
      this.cursorName = 'pointer';
      this.selTables  = {};
      this.rellyStep = 1;
      this.canvasObj.style.cursor = this.cursorName;
      this.drawAll();
    },

    init : function(){
      this.img.src = "C:/Users/charv/OneDrive/Pictures/Mybatis001.PNG";
    },
    rellyEnd : function() {
      this.addBiRelly(this.rellyStartTable, this.rellyEndTable);
      this.vRellySX = null;
      this.vRellySY = null;
      this.vRellyEX = null;
      this.vRellyEY = null;
      this.rellyStartTable = null;
      this.rellyEndTable = null;
      this.rellyStep = 0;
      this.cursorName = '';
      this.drawAll();
    },

    rellyCancel : function() {
      this.rellyStartTable = null;
      this.rellyEndTable = null;
      this.rellyStep = 0;
      this.cursorName = '';
      this.drawAll();
    },
    //*********************************************************************************************
    //
    //*********************************************************************************************
    addBiRelly : function(sTbl, eTbl) {
      let id1 = sTbl.id + "_" + eTbl.id;
      let id2 = eTbl.id + "_" + sTbl.id;
      if(this.Rellys.hasOwnProperty(id1)) {
        alert("이미 관계가 존재합니다.");
        return;
      }
      if(this.Rellys.hasOwnProperty(id2)) {
        alert("이미 역순의 관계가 존재합니다.");
        return;
      }
      let newRelly = new BiRelly(sTbl, eTbl);
      this.Rellys[newRelly.id] = newRelly;
    },
    //*********************************************************************************************

    searchInData : function(searchTxt, notFoundCallback){
      let findedKey = '';

      if(curSearchNm == searchTxt){
        searchTxt = searchTxt.toLowerCase();
        let findcur = false;
        for(let key in this.tables){
          let dumy1 = this.tables[key].tLogicalName.toLowerCase();
          let dumy2 = this.tables[key].tPysicalName.toLowerCase();
          if(key == curSearchId){
            findcur = true;
            continue;
          }
          if(!findcur) continue;
          if(dumy1.indexOf(searchTxt) >= 0){
            findedKey = key;
            curSearchId = key;
            break;
          }else if(dumy2.indexOf(searchTxt) >= 0){
            findedKey = key;
            curSearchId = key;
            break;
          }
        }
      }else{
        curSearchNm = searchTxt;
        searchTxt = searchTxt.toLowerCase();
        for(let key in this.tables){
          let dumy1 = this.tables[key].tLogicalName.toLowerCase();
          let dumy2 = this.tables[key].tPysicalName.toLowerCase();
          if(dumy1.indexOf(searchTxt) >= 0){
            findedKey = key;
            curSearchId = key;
            break;
          }else if(dumy2.indexOf(searchTxt) >= 0){
            findedKey = key;
            curSearchId = key;
            break;
          }
        }
      }
 
      let sl = 600;       // 임시로 상수화해놨으나, 실제 모니터 해상도에 다라서 계산되어야 한다.
      let st = 400;
      if(findedKey != ''){
        this.selTables = {};
        this.selTables[findedKey] = this.tables[findedKey];
        camX = this.tables[findedKey].px - sl;
        camY = this.tables[findedKey].py - st;
        this.drawAll();
      }else{
        notFoundCallback(searchTxt);
      }
    },

    //*********************************************************************************************
    //
    //*********************************************************************************************
    addNewTable : function(x, y){
      let xPos = Math.floor(S2R_X(x)/this.snap) * this.snap;
      let yPos = Math.floor(S2R_Y(y)/this.snap) * this.snap;
      this.maxSeq++;
      let tableObj = new BiERDTable();
      let boxId = this.maxSeq.toString(36);
      tableObj.id = boxId;
      tableObj.init(this.dc);
      tableObj.px = xPos;
      tableObj.py = yPos;
      tableObj.setTableHead(this.dc, "", "", "");
      tableObj.addColumn(this.dc, ['' , '' , '', '', '', '', '', '']);

      this.tables[boxId] = tableObj;
      tableObj.draw(this.dc, true);
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 화면에 모든 데이터를 그린다.
    //*********************************************************************************************
    drawAll : function (){
      this.dc.clearRect(0, 0, this.canvasObj.width, this.canvasObj.height);

      //*******************************************************************************************
      // 그리드 그리기
      //*******************************************************************************************
      if(this.grid > 0){
        this.dc.strokeStyle = this.gridColor;
        this.dc.lineWidth = this.gridLineWidth;
        this.dc.beginPath();
        for(let i=this.grid;i<this.canvasObj.width;i+=this.grid) {
          this.dc.moveTo(i, 0);
          this.dc.lineTo(i, this.canvasObj.height);
        }
        for(let i=this.grid;i<this.canvasObj.height;i+=this.grid) {
          this.dc.moveTo(0, i);
          this.dc.lineTo(this.canvasObj.width, i);
        }
        this.dc.stroke();
      }
      //*********************************************************************************************



      //*******************************************************************************************
      //
      //*******************************************************************************************
      for(var id in this.Rellys){
        this.Rellys[id].draw(this.dc, false);
      }
      for(var id in this.selRellys){
        this.selRellys[id].draw(this.dc, true);
      }
      if(this.vRellySX != null){
        this.dc.beginPath();
        this.dc.lineWidth = 3;
        this.dc.strokeStyle = '#0a0ac8';
        this.dc.moveTo(this.vRellySX, this.vRellySY);
        this.dc.lineTo(this.vRellyEX, this.vRellyEY);
        this.dc.stroke();
      }
      //*******************************************************************************************



      //*******************************************************************************************
      //
      //*******************************************************************************************
      for(var id in this.tables){
        this.tables[id].draw(this.dc, false);
      }
      for(var id in this.selTables){
        this.selTables[id].draw(this.dc, true);
      }
      //*******************************************************************************************

      //this.dc.drawImage(this.img, 100,100, 200, 200);

    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 브라우저 마우스 오른쪽 버튼 클릭시 나오는 팝업메뉴 안보이도록 하기 위함
    //*********************************************************************************************
    contextMenu : function(e){
      e.preventDefault();
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 단순히 화면만 살짝 클리어 할 뿐.... drawAll을 부르면 다시 화면에 항목들이 그려진다.
    //*********************************************************************************************
    clearAll : function (){
      this.dc.clearRect(0, 0, this.canvasObj.width, this.canvasObj.height);
    },
    //*********************************************************************************************
       


    //*********************************************************************************************
    //
    //*********************************************************************************************
    onClick : function(event){
      
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 마우스 버튼 다운 이벤트
    //*********************************************************************************************
    onMouseDown : function(event){
      this.mouseButton = event.button;
      this.isMouseDown = true;
      if(this.mouseButton == 0) {                                            /* 마우스 왼쪽 버튼 눌림 */
        //*****************************************************************************************
        // 각 노드별 마우스 커서 형태 및 모드 감지
        //*****************************************************************************************
        if(this.onBeforeMouseDown) this.onBeforeMouseDown(event);           /* 차후 개발 계획 ( 마우스 다운 이벤트 직전에 수행해야 할 사항 ) */
        
        //*****************************************************************************************
        // 위의 사이즈, 링크등의 편집이 감지되지 않았으면 노드 선택하기를 감지한다. (우선 일반노드먼저)
        // 현재는 해당 포인트에 모두 속하는 노드들을 선택하도록 해놨는데... 음... 
        // 있다 보자고~ 한방에 여러개가 선택되는게 영~ 이상하면 그때 여기서 작업을 좀 해야긋제
        //*****************************************************************************************
        if(this.cursorName == null){
          if(!ctrlDown) {                                            /* 컨트롤키 눌려져 있지 않을 경우엔 기존 선택된 항목을 초기화 한다. */
            this.selTables = {};
            this.selRellys = {};
          }

          let isSelected = false;
          /*******************************************************************
          현재는 해당 포인트에 모두 속하는 노드들을 선택하도록 해놨는데... 음... 
          있다 보자고~ 한방에 여러개가 선택되는게 영~ 이상하면 그때 여기서 작업을 좀 해야긋제
          ********************************************************************/
          this.firstX = event.offsetX;
          this.firstY = event.offsetY;
          for(let tblKey in this.tables){
            let selectInfo = this.tables[tblKey].select(event.offsetX, event.offsetY);
            if(selectInfo != null){
              this.selTables[tblKey] = this.tables[tblKey];
              isSelected = true;
              break;
            }
          }
          if(!isSelected){
            for(let rellyKey in this.Rellys){
              let selectInfo = this.Rellys[rellyKey].select(event.offsetX, event.offsetY, this.resizeMouseGap);
              if(selectInfo == null) continue;
              this.selRellys[rellyKey] = this.Rellys[selectInfo.dataInfo];
              break;
            }
          }
          this.drawAll();
        }else if(this.rellyStep == 1){
          this.firstX = event.offsetX;
          this.firstY = event.offsetY;
          for(let tblKey in this.tables){
            let selectInfo = this.tables[tblKey].select(event.offsetX, event.offsetY);
            if(selectInfo != null && this.rellyStep == 1){
              this.rellyStartTable = this.tables[tblKey];
              this.rellyStep = 2;
            }
          }
        }
        //*****************************************************************************************


        if(this.onAfterSelect) this.onAfterSelect(event);                   /* 차후 개발 계획 ( 아이템 선택 직후에 자동으로 수행해야 할 사항 ) */
        //*****************************************************************************************
      }else{                                                                /* 마우스 왼쪽 버튼이 아닌 다른 버튼 (오른쪽=2) */
        this.firstX = event.offsetX;
        this.firstY = event.offsetY;
      }
    },
    onMouseMove : function(event){
      
      //*******************************************************************************************
      // 크기변경, 노드링크연결, 카메라 이동등등
      //*******************************************************************************************
      if(this.isMouseDown && this.mouseButton == 0){                        /* 마우스 왼쪽버튼 눌려진 상태 */
        if(this.rellyStep == 2){
          let ssx = this.rellyStartTable.px + this.rellyStartTable.width  / 2;
          let ssy = this.rellyStartTable.py + this.rellyStartTable.height / 2;
          this.vRellySX = R2S_X(ssx);
          this.vRellySY = R2S_Y(ssy);
          this.vRellyEX = event.offsetX;
          this.vRellyEY = event.offsetY;
        }else{
          let xPos = Math.floor((event.offsetX-this.firstX)/this.snap) * this.snap;
          let yPos = Math.floor((event.offsetY-this.firstY)/this.snap) * this.snap;
          for(let id in this.selTables){
            this.selTables[id].moveView(xPos, yPos);
          }
        }
        this.drawAll();
      }else if(this.isMouseDown && this.mouseButton == 2){                  /* 마우스 오른쪽 버튼이 눌려진 상태 : Cam Move Mode */
        let dx = this.firstX - event.offsetX;
        let dy = this.firstY - event.offsetY;
        moveScreen(dx, dy);
        this.firstX = event.offsetX;
        this.firstY = event.offsetY;
        this.drawAll();
      }
      //*******************************************************************************************
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 마우스 버튼 땠을때 : 어느버튼이 때졌느냐에 따라서 요리조리 튕기것제~
    //*********************************************************************************************
    onMouseUp : function(event){
      this.isMouseDown = false;

      if(this.mouseButton == 0){
        if(this.rellyStep == 0){
          let xPos = Math.floor((event.offsetX-this.firstX)/this.snap) * this.snap;
          let yPos = Math.floor((event.offsetY-this.firstY)/this.snap) * this.snap;
          for(let id in this.selGroups){
            this.selGroups[id].moveTo(xPos, yPos);
          }
          this.drawAll();
        }else if(this.rellyStep == 2){
          this.firstX = event.offsetX;
          this.firstY = event.offsetY;
          for(let tblKey in this.tables){
            let selectInfo = this.tables[tblKey].select(event.offsetX, event.offsetY);
            if(selectInfo != null){
              this.rellyEndTable = this.tables[tblKey];
              break;
            }
          }
          if(this.rellyEndTable != null) this.rellyEnd();
        }
      }else if(this.mouseButton == 2){                                    /* Camera 이동모드 종료 */
        camX = Math.floor(camX/this.snap) * this.snap;
        camY = Math.floor(camY/this.snap) * this.snap;
        this.drawAll();
      }
    
      this.curNodeId    = null;
      this.cursorName   = null;
      this.canvasObj.style.cursor = '';
      this.mouseButton  = -1;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 디자이너 메모리 클리어~ 초기화
    //*********************************************************************************************
    clean : function(camClean){
      if(camClean){
        camX = 0;
        camY = 0;
      }
      this.maxSeq       = 0;
      this.Groups       = [];
      this.selGroups    = [];
      this.curNodeId    = null;
      this.cursorName   = null;
      this.isMouseDown  = false;
      this.mouseButton  = -1;
      this.firstX       = 0;
      this.firstY       = 0;
    },
    //*********************************************************************************************


    
    //*********************************************************************************************
    onBeforeMouseDown : null,
    onAfterSelect : null,
    //*********************************************************************************************
    // 객체 선택해서 팝업 띄우려 한다.
    // 던지는 객체는 엄연히 다르지만, 서로 text, bodyColor, id 등등의 변경세팅하려하는 
    // Property는 같은 이름으로 같이 존재하므로 자연스럽게 CallByReference로 동작이 된다.
    //*********************************************************************************************
    onDblClick : function(event){
      if(this.openBiEditPop == null){
        console.log("openBiEditPop 함수를 세팅하지 않았습니다.");
        return;
      }
      for(let id in this.tables){
        let selectInfo = this.tables[id].select(event.offsetX, event.offsetY);
        if(selectInfo == null) continue;
        this.selTables= {};
        this.selTables[id] = this.tables[selectInfo.dataInfo];
        this.openBiEditPop(this.tables[selectInfo.dataInfo], "Table");
      }
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 현재 선택된 모든 메모리를 지운다.
    //*********************************************************************************************
    deleteSelItems : function(){
      for(let key in this.selTables){
        delete this.tables[key];
      }
      this.selTables = {};
      for(let key in this.selRellys){
        delete this.Rellys[key];
      }
      this.selRellys = {};
    },
    //*********************************************************************************************



    //*********************************************************************************************
    // 사용처(화면 페이지)에서 해당 함수를 등록해줘야 되것제? ㅋ
    //*********************************************************************************************
    setBiEditFunction  : function(callBackFunction){
      this.openBiEditPop = callBackFunction;
    },
    //*********************************************************************************************

    
    //*********************************************************************************************
    //
    //*********************************************************************************************
    getJsonData : function() {
      let tableGroup = {};
      let rellyGroup = {};
      for(let tableKey in this.tables){
        let oneTable = this.tables[tableKey].getJsonData();
        tableGroup[tableKey] = oneTable;
      }
      for(let rellyKey in this.Rellys){
        let oneRelly = this.Rellys[rellyKey].getJsonData();
        rellyGroup[rellyKey] = oneRelly;
      }
      let jsonData = {
        camX : camX,
        camY : camY,
        tableGroup : tableGroup,
        rellyGroup : rellyGroup,
      }
      return jsonData;
    },

    loadFromJson : function(jsonObj, dc){
      this.clean(true);
      camX = jsonObj.camX;
      camY = jsonObj.camY;
      let maxId = 0;
      for(key in jsonObj.tableGroup){
console.log("key = " + key + ", key_INT = " + parseInt(key, 36) + ", maxId = " + maxId);        
        if(maxId < parseInt(key, 36)) maxId = parseInt(key, 36);

        let oTable = jsonObj.tableGroup[key];
        this.tables[key] = new BiERDTable();
        this.tables[key].id = key;
        this.tables[key].init(dc);
        this.tables[key].px = oTable.px;
        this.tables[key].py = oTable.py;
        this.tables[key].setTableHead(dc
                                    , oTable.tLogicalName
                                    , oTable.tPysicalName
                                    , oTable.tDescription);
        for(let i=0;i<oTable.cPysicalNames.length;i++){
          this.tables[key].addColumn(dc,
            [ oTable.cPysicalNames[i]
            , oTable.cLogicalNames[i]
            , oTable.cTypes[i]
            , oTable.cLengths[i]
            , oTable.cIsPks[i]
            , oTable.cNullables[i]
            , oTable.cDefaults[i]
            , oTable.cDescriptions[i]
            ]
          );
        };
      }
      for(key in jsonObj.rellyGroup){
        let rKeys = key.split("_");
        this.addBiRelly(this.tables[rKeys[0]], this.tables[rKeys[1]]);
      }
      this.maxSeq = maxId;
console.log('최종 maxId = ' + maxId);
      this.drawAll();
    }, 
    clean : function(camClean){
      if(camClean){
        camX = 0;
        camY = 0;
        this.maxSeq = 0;
        this.tables = [];
        this.Rellys = [];
        this.selTables = [];
        this.selRallys = [];
        this.curNodeId    = null;
        this.cursorName   = null;
        this.isMouseDown  = false;
        this.mouseButton  = -1;
      }
    },
    drawMiniMap : function(dc, cWidth, cHeight){
      let minX = 99999;
      let minY = 99999;
      let maxX = -99999;
      let maxY = -99999;
      let dataWidth = 0;
      let dataHeight = 0;

      //*******************************************************************************************
      // 분포된 데이터의 전체 사이즈 체크
      //*******************************************************************************************
      for(let key in this.tables){
        if(minX > this.tables[key].px) minX = this.tables[key].px;
        if(minY > this.tables[key].py) minY = this.tables[key].py;
        if(maxX < (this.tables[key].px + this.tables[key].width )) maxX = this.tables[key].px + this.tables[key].width;
        if(maxY < (this.tables[key].py + this.tables[key].height)) maxY = this.tables[key].py + this.tables[key].height;
      } 

      //*******************************************************************************************
      if(minX > camX) minX = camX;
      if(minY > camY) minY = camY;
      if(maxX < (camX + canvas.width )) maxX = camX + canvas.width;
      if(maxY < (camY + canvas.height)) maxY = camY + canvas.height;

      //*******************************************************************************************
      // 실제 데이터의 최소, 최대 좌표값으로 데이터 넓이와 높이를 구한다.
      //*******************************************************************************************
      dataWidth  = maxX - minX;
      dataHeight = maxY - minY;
      //*******************************************************************************************

      let rw = cWidth / dataWidth;
      let rh = cHeight / dataHeight;
      let rate = rw;
      if(rw > rh) rate = rh;                                    // 실제데이터와 미니맵의 크기에 맞춰서 일그러짐 없게 하기 위해 최소배율을 적용한다.

      dc.clearRect(0, 0, cWidth, cHeight);
      dc.strokeStyle  = '#a8a8a8';
      dc.lineWidth    = 1;
      dc.beginPath();
      for(let key in this.tables){
        let sx = this.tables[key].px - minX;                 // 최소값의 좌표가 0이 되어야 하기 때문에 minX를 빼준다.
        let sy = this.tables[key].py - minY;                 // 최소값의 좌표가 0이 되어야 하기 때문에 minY를 빼준다.
        let ww = this.tables[key].width;
        let hh = this.tables[key].height;
        dc.moveTo(sx*rate, sy*rate);
        dc.strokeRect(sx*rate, sy*rate, ww*rate, hh*rate);
      }
      // for(let key in this.Rellys){
      //   let sx = this.Rellys[key].spX - minX;
      //   let sy = this.Rellys[key].spY - minY;
      //   let ex = this.Rellys[key].epX - minX;
      //   let ey = this.Rellys[key].epY - minY;
      //   dc.moveTo(sx*rate, sy*rate);
      //   dc.lineTo(ex*rate, ey*rate);
      // }
      dc.stroke();
      //*******************************************************************************************
      // 현재 화면이 있는 위치를 미니맵에 표시한다.
      //*******************************************************************************************
      dc.beginPath();
      dc.lineWidth = 2;
      dc.strokeStyle = '#EA5252';
      dc.moveTo((camX - minX)*rate, (camY-minY)*rate);
      dc.strokeRect((camX - minX)*rate, (camY-minY)*rate, canvas.width*rate, canvas.height*rate);
      dc.stroke();
      //*******************************************************************************************
    },
    getScriptText : function(osName){
      
      if(osName == null || osName == '') osName = "windows";
      let systemName = osName.toLowerCase();
      let scriptText = "";
      let newLine = systemName == "windows" ? "\r\n" : "\n";

      for(let key in this.tables){
        scriptText += this.tables[key].getScriptText(osName) + newLine + newLine;
      }
      return scriptText;
    }
  };  
  //************************************************************************* End Of ScreenDesigner



  //***********************************************************************************************
  // 이벤트 연결부
  //***********************************************************************************************
  canvas.addEventListener("click"      , function(e) {  rtn.onClick(e);     });
  canvas.addEventListener("dblclick"   , function(e) {  rtn.onDblClick(e);  });
  canvas.addEventListener("mousedown"  , function(e) {  rtn.onMouseDown(e); });
  canvas.addEventListener("mousemove"  , function(e) {  rtn.onMouseMove(e); });
  canvas.addEventListener("mouseup"    , function(e) {  rtn.onMouseUp(e);   });
  canvas.addEventListener("contextmenu", function(e) {  rtn.contextMenu(e); });
  //***********************************************************************************************

  return rtn;
}
//*************************************************************************************************
