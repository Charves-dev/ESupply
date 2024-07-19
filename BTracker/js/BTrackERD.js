//*************************************************************************************************
//
//*************************************************************************************************
var camX                = 0;
var camY                = 0;
var ctrlDown            = false;
var lineTypes           = {'solidLine' : []
                          ,'dashLine'  : [2,3] 
                          };
var lineMode            = 'solidLine';
var BTrackCursor        = {'HVResize'  :'se-resize'
                          ,'HResize'   :'w-resize'
                          ,'MouseLink' :'pointer'
                          ,'Cross'     :'crosshair'
                          };
var browserW            = 0;
var browserH            = 0;
var curSearchNm         = '';
//*************************************************************************************************


  
//*************************************************************************************************
//
//*************************************************************************************************
function EventCheckResult(){
  var rtn = {
    clsName  : null,    // Class Name
    vectInfo : null,    // Left, Top, Right, Bottom
    idxInfo  : null,    // 0, 1, 2, 3, 4
    idInfo   : null,    // Object ID
    dataInfo : null,    // Result Data
    msgInfo  : null,
    etcInfo  : null,
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
// 실제 메모리에 저장된 좌표값을 화면상으로 나타내기 위한 좌표로 변환(Draw시에 활용)
//*************************************************************************************************
function R2S_X(px){   return px - camX;}  
function R2S_Y(py){	  return py - camY;}
//*************************************************************************************************



//*************************************************************************************************
// 화면에 클릭 혹은 어떤 이벤트 발생시 해당 화면 좌표에 대한 현재 실제좌표값 변환(Mouse Event시에 활용)
//*************************************************************************************************
function S2R_X(px){   return px + camX;}
function S2R_Y(py){   return py + camY;}
//*************************************************************************************************



//*************************************************************************************************
// 화면(카메라) 가 움직이는것 처럼 보이게 하기 위한 카메라의 절대좌표 이동
//*************************************************************************************************
function moveScreen(x, y){
	camX = camX + x;
	camY = camY + y;
}
//*************************************************************************************************



//*************************************************************************************************
// 한점과 직선 사이의 거리를 구하는 함수
//*************************************************************************************************
function getPL_Dist(sx, sy, ex, ey, ax, ay){
  let area  = Math.abs((sx-ax)*(ey-ay) - (sy-ay)*(ex-ax));
  let ab    = Math.sqrt((sx-ex)*(sx-ex) + (sy-ey)*(sy-ey));
  //return Math.floor(area / ab);   // 내림
  //return Math.round(area / ab);   // 반올림
  return Math.ceil(area / ab);      // 올림
}
//*************************************************************************************************



//*************************************************************************************************
//
//*************************************************************************************************
function drawTextBox(dc, node) {
  let drX = R2S_X(node.sPT.px) + 12;
  let drY = R2S_Y(node.sPT.py) + 12;
  var fontSize = parseFloat(dc.font);
  var currentY = drY;
  dc.textBaseline = "top";

  let textAr = node.text.split('\n');
  for(let i=0;i<textAr.length;i++){
    if(textAr[i].startsWith('[')){
      dc.fillStyle = '#fb3010';
      dc.font = 'normal ' + node.drawFontSize + 'px ' + node.drawFontName;
    }else if(textAr[i].startsWith('*')){
      dc.fillStyle = '#1030fb';
      dc.font = 'normal ' + node.drawFontSize + 'px ' + node.drawFontName;
    }else if(textAr[i].startsWith('@')){
      dc.fillStyle = '#000000';
      dc.font = 'normal ' + node.drawFontSize + 'px ' + node.drawFontName;
    }else{
      dc.fillStyle = '#101010';
      dc.font = 'normal ' + node.drawFontSize + 'px ' + node.drawFontName;
    }

    if(dc.measureText(textAr[i]).width + 12 < node.size.width){
      dc.fillText(textAr[i], drX, currentY);
      currentY += fontSize*1.5;
    }else{
      let txlineN = '';
      let txlineO = '';
      for(let j=0; j<textAr[i].length; j++){
        txlineN += textAr[i][j];
        if(dc.measureText(txlineN).width + 12 < node.size.width){
          txlineO = txlineN;
        }else{
          dc.fillText(txlineO, drX, currentY);
          txlineN = '';
          txlineO = '';
          currentY += fontSize*1.5;
        }
      }
      if(txlineO != '') dc.fillText(txlineO, drX, currentY);
      currentY += fontSize*1.5;
    }
  }
}
//*************************************************************************************************



//*************************************************************************************************
// 포인트 객체(객체의 위치정보)
//*************************************************************************************************
function BasicPoint(x, y){
  var rtn = {
    px : x,
    py : y,
    copyFrom : function(pt){
      this.px = pt.px;
      this.py = pt.py;
    },
    checkPoint : function(cx, cy, gap){
      if(cx <= this.px + gap && cx >= this.px - gap && cy <= this.py + gap && cy >= this.py - gap){
        return 'pointer';
      }
      return null;
    },
    printPoint : function(str){
      console.log(str + " : px=" + this.px + ", py=" + this.py);
    },
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
// 사이즈 객체(객체의 크기 정보)
//*************************************************************************************************
function BasicSize(w, h){
  var rtn = {
    width      : w,
    height     : h,
    getCenterPT : function(pt){
      let center = new BasicPoint(pt.px, pt.py);
      center.px = pt.px + (this.width/2);
      center.py = pt.py + (this.height/2);
      return center;
    },
    getCenterX : function(pt){ return pt.px + (this.width/2);  },           // 객체의 x축 가운데 지점(BasicPoint에 두는게 맞으려나? 여기 두는게 맞으려나?)
    getCenterY : function(pt){ return pt.py + (this.height/2); },           // 객체의 y축 가운데 지점(BasicPoint에 두는게 맞으려나? 여기 두는게 맞으려나?)
    getEndPT : function(pt){
      let endp = new BasicPoint(pt.px, pt.py);
      endp.px = pt.px + this.width;
      endp.py = pt.py + this.height;
      return endp;
    },
    getEndX    : function(pt){ return pt.px + this.width;   },  //
    getEndY    : function(pt){ return pt.py + this.height;  },  //
    copyFrom   : function(sz){
      this.width = sz.width;
      this.height = sz.height;
    },
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
//
//*************************************************************************************************
function BiGroup() {
  var rtn = {
    id              : '',
    sPT             : null,
    size            : null,
    text            : '',
    bodyColor       : '',
    edgeColor       : '#969696',
    widthResiable   : true,
    heightResiable  : true,
    drawFontSize    : 14,
    drawFontName    : ' Tahoma',
    oPT             : null,                                                 // 이동시에 예전 위치값을 가지고 있다가 취소되면 제자리로 돌아갈 수 있게 하기 위한 의도로 사용된다.

    checkCursorPoint : function (x, y, gap){
      x = S2R_X(x);
      y = S2R_Y(y);
      if(this.widthResiable){
        if(this.heightResiable){
          if(y >= this.sPT.py+this.size.height-gap &&
             y <= this.sPT.py+this.size.height+gap &&
             x >= this.sPT.px+this.size.width-gap &&
             x <= this.sPT.px+this.size.width+gap){
              let eventCheckInfo = new EventCheckResult();
              eventCheckInfo.clsName = 'string';
              eventCheckInfo.dataInfo = BTrackCursor['HVResize'];
              return eventCheckInfo;
          }
          return null;
        }else{
          if(y >= this.sPT.py &&
             y <= this.sPT.py+this.size.height &&
             x >= this.sPT.px+this.size.width-gap &&
             x <= this.sPT.px+this.size.width+gap){
              let eventCheckInfo = new EventCheckResult();
              eventCheckInfo.clsName = 'string';
              eventCheckInfo.dataInfo = BTrackCursor['HResize'];
              return eventCheckInfo;
          }
          return null;
        }
      }
    },
    draw : function(dc, isSelected){
      let drX = R2S_X(this.sPT.px);
      let drY = R2S_Y(this.sPT.py);
      dc.beginPath();
      dc.fillStyle = this.bodyColor;
      dc.fillRect(drX, drY, this.size.width, 40);
      if(isSelected){
        dc.strokeStyle = '#fa9664';
        dc.lineWidth = 3;
        dc.strokeRect(drX, drY, this.size.width, this.size.height);
      }else{  
        dc.strokeStyle = this.edgeColor;
        dc.lineWidth = 1;
        dc.strokeRect(drX, drY, this.size.width, this.size.height);
      }

      // resize 하기 위한 표식을 표시
      dc.fillStyle = '#c83232';
      dc.fillRect(drX + this.size.width-1 , drY + this.size.height-10, 3, 11);
      dc.fillRect(drX + this.size.width-10, drY + this.size.height-1, 11, 3);
      
      // 텍스트 표시
      dc.font = this.drawFontSize + 'px ' + this.drawFontName;
      drawTextBox(dc, this);
    },
    select : function (px, py){
      px = S2R_X(px);
      py = S2R_Y(py);
      if(this.sPT.px                  > px)  return null;
      if(this.sPT.py                  > py)  return null;
      if(this.size.getEndX(this.sPT)  < px)  return null;
      if((this.sPT.py + 40)           < py)  return null;
      let eventCheckInfo      = new EventCheckResult();
      eventCheckInfo.clsName  = 'BiGroup';
      eventCheckInfo.dataInfo = this.id;
      return eventCheckInfo;
    },
    moveTo : function (px, py){
      if(this.sPT.px != this.oPT.px || this.sPT.py != this.oPT.py){
        this.sPT.px = this.oPT.px + px;
        this.sPT.py = this.oPT.py + py;
        this.oPT.copyFrom(this.sPT);
      }
    },
    moveView : function (px, py){
      this.sPT.px = this.oPT.px + px;
      this.sPT.py = this.oPT.py + py;
    },
  };
  return rtn;
}    
//*************************************************************************************************



//*************************************************************************************************
//
//*************************************************************************************************
function BiERDTable(){
  var rtn = {
    id              : '',
    px              : 0,
    py              : 0,
    ox              : -1,
    oy              : -1,
    width           : 200,
    height          : 200,
    lineColor       : '#777777',
    cellColor       : '#FFFFFC',
    rowHeight       : 20,
    txtLineGap      : 4,
    snap            : 20,
    tLogicalName    : '',
    tPysicalName    : '',
    tDescription    : '',
    drawFontSize    : 14,
    drawFontName    : ' Tahoma',
    viewOption      : 1,                                                    // 1:전체보기, 2:물리명만 보기, 3:물리명+논리명, 4:물리명+논리명+타입+크기

    cTitles         : ['물리명', '논리명', '타입', '크기', 'PK', 'Null', 'Default', '상세설명'],
    cLineX          : [],
    cPropWidths     : [80, 80, 80, 80, 80, 80, 80, 80],                     // 칼럼속성뷰 칼럼 Width값 (안보이는건 0로 세팅)

    cPysicalNames   : [],                                                   // 칼럼 물리적이름        index = 0
    cLogicalNames   : [],                                                   // 칼럼 논리적이름        index = 1
    cTypes          : [],                                                   // 칼럼 타입(Type)        index = 2
    cLengths        : [],                                                   // 칼럼 크기(Size)        index = 3
    cIsPks          : [],                                                   // 칼럼 PK여부            index = 4
    cNullables      : [],                                                   // 칼럼 Null가능여부      index = 6
    cDefaults       : [],                                                   // 칼럼 기본값            index = 5
    cDescriptions   : [],                                                   // 칼럼 물리적이름        index = 7
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    init : function(dc){
      dc.textBaseline = 'top';
      dc.font         = 'normal 14px Tahoma';
      let appendWidth = 0;
      for(let i=0;i<this.cTitles.length;i++){
        this.cLineX[i] = appendWidth;
        let w = dc.measureText(this.cTitles[i]).width + this.txtLineGap*2;
        this.cPropWidths[i] = Math.ceil(w/this.snap) * this.snap;
        appendWidth += this.cPropWidths[i];
      }
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    getScriptText : function(osName){
      if(osName == null || osName == '') osName = "windows";
      let systemName = osName.toLowerCase();
      let newLine = systemName == "windows" ? "\r\n" : "\n";
      let tScript = "CREATE TABLE `" + this.tPysicalName + "` (" + newLine;
      let PKs = "";
      for(let i=0;i<this.cPysicalNames.length;i++){
// console.log(this.cPysicalNames[i]);
// console.log(this.cTypes[i]);
// console.log(this.cLengths[i]);
// console.log(this.cIsPks[i]);
// console.log(this.cNullables[i]);
// console.log(this.cDefaults[i]);
// console.log(this.cLogicalNames[i]);


        tScript += " `" + this.cPysicalNames[i] + "` " + this.cTypes[i] + "(" + this.cLengths[i] + ")"; 
        if(this.cNullables[i] == "N") tScript += " NOT NULL";
        if(this.cDefaults[i] != "") tScript += " DEFAULT " + this.cDefaults[i];
        if(this.cLogicalNames[i] != "") tScript += " COMMENT '" + this.cLogicalNames[i] + "'," + newLine;
        else tScript += "," + newLine;
        if(this.cIsPks[i] == "Y") PKs += ",`" + this.cPysicalNames[i] + "`";
//console.log(tScript);        
      }
      if(PKs != "") tScript += " PRIMARY KEY (" + PKs.substring(1) + ")" + newLine;
      tScript += ") ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='"+ this.tLogicalName + "';";
      return tScript;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    getJsonData : function(){
      let viewObj = {
        px : this.px,
        py : this.py,
        width : this.width,
        height : this.height,
        tLogicalName : this.tLogicalName,
        tPysicalName : this.tPysicalName,
        cLineX       : [...this.cLineX],
        cPropWidths  : [...this.cPropWidths],
        cPysicalNames: [...this.cPysicalNames],
        cLogicalNames: [...this.cLogicalNames],
        cTypes       : [...this.cTypes],
        cLengths     : [...this.cLengths],
        cIsPks       : [...this.cIsPks],
        cNullables   : [...this.cNullables],
        cDefaults    : [...this.cDefaults],
        cDescriptions: [...this.cDescriptions],
      }
      return viewObj;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    setTableHead : function(dc, lName, pName, desc){
      let lNameWidth = dc.measureText(lName).width;
      let pNameWidth = dc.measureText(pName).width;
      if(lNameWidth > pNameWidth) this.width = Math.ceil((lNameWidth + this.txtLineGap*2)/this.snap) * this.snap;    // 칼럼계산하는 부분에서 언제든지 바꿀 수 있다.
      else                        this.width = Math.ceil((pNameWidth + this.txtLineGap*2)/this.snap) * this.snap;
      this.tLogicalName = lName;
      this.tPysicalName = pName;
      this.tDescription = desc;

      let tableWidth = 0;
      for(let i=0;i<this.cPropWidths.length;i++){
        tableWidth += this.cPropWidths[i];
      }
      if(this.width < tableWidth) this.Width = tableWidth;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    addColumn : function(dc, propInfos){
      // propInfos[0] : 하나의 Row[물리명, 논리명, 타입, 크기, PK, Null, Default, 상세설명]
      if(propInfos.length < 8){
        console.log("addColumn() : 속성값의 갯수가 모자랍니다.");
        return;
      }
      let conBoldGap = [20,0,0,0,0,0,0,0];
      let appendWidth = 0;
      for(let i=0;i<this.cPropWidths.length;i++){
        this.cLineX[i] = appendWidth;
        let cWidth = dc.measureText(propInfos[i]).width + this.txtLineGap*2 + conBoldGap[i];
        if(this.cPropWidths[i] < cWidth) this.cPropWidths[i] = Math.ceil(cWidth/this.snap) * this.snap;
        appendWidth += this.cPropWidths[i];
      }

      let tableWidth = 0;
      for(let i=0;i<this.cPropWidths.length;i++){
        tableWidth += this.cPropWidths[i];
      }
      if(this.width < tableWidth) this.width = tableWidth;

      this.cPysicalNames.push(propInfos[0]);
      this.cLogicalNames.push(propInfos[1]);
      this.cTypes.push(propInfos[2]);
      this.cLengths.push(propInfos[3]);
      this.cIsPks.push(propInfos[4]);
      this.cNullables.push(propInfos[5]);
      this.cDefaults.push(propInfos[6]);
      this.cDescriptions.push(propInfos[7]);

      this.height = (3 + this.cPysicalNames.length) * this.rowHeight;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    // viewOption      :  1:전체보기, 2:물리명만 보기, 3:물리명+논리명, 4:물리명+논리명+타입+크기
    //*********************************************************************************************
    draw : function(dc, isSelected){
      let drX = R2S_X(this.px);
      let drY = R2S_Y(this.py);
      let txtY = drY + this.txtLineGap;
      let txtX = drX + this.txtLineGap;

      dc.beginPath();
      dc.fillStyle = '#EDEDFF';
      dc.fillRect(drX, drY, this.width, this.rowHeight*2);
      dc.fillStyle = '#EDFFED';
      dc.fillRect(drX, drY + this.rowHeight*2, this.width, this.rowHeight);
      dc.fillStyle = this.cellColor;
      dc.fillRect(drX, drY + this.rowHeight*3, this.width, this.cPysicalNames.length * this.rowHeight);

      if(isSelected){
        dc.strokeStyle = '#fa9664';
        dc.lineWidth = 3;
      }else{
        dc.strokeStyle = this.lineColor;
        dc.lineWidth = 2;
      }
      dc.moveTo(drX, txtY);
      dc.strokeRect(drX, drY, this.width, this.height);
      dc.moveTo(drX, drY + this.rowHeight);
      dc.lineTo(drX + this.width, drY + this.rowHeight);
      dc.moveTo(drX, drY + this.rowHeight*2);
      dc.lineTo(drX + this.width, drY + this.rowHeight*2);
      dc.moveTo(drX, drY + this.rowHeight*3);
      dc.lineTo(drX + this.width, drY + this.rowHeight*3);

      dc.lineWidth = 1;

      //*******************************************************************************************
      // 칼럼 속성 표현하는 영역 세로선 그리기
      //*******************************************************************************************
      let tY = drY + this.rowHeight*2;
      for(let i=0;i<this.cLineX.length;i++){
        dc.moveTo(drX + this.cLineX[i], tY);
        dc.lineTo(drX + this.cLineX[i], drY + this.height);
      }
      //*******************************************************************************************


      //*******************************************************************************************
      // 칼럼 속성표현하는 영역 가로선 그리기
      //*******************************************************************************************
      tY += this.rowHeight;
      for(let i=0;i<this.cPysicalNames.length;i++){
        dc.moveTo(drX, tY);
        dc.lineTo(drX + this.width, tY);
        tY += this.rowHeight;
      }
      //*******************************************************************************************
      dc.stroke();

      //*******************************************************************************************
      //
      //*******************************************************************************************
      dc.beginPath();
      dc.textBaseline = 'top';
      dc.font         = 'normal 14px Tahoma';
      dc.fillStyle    = '#363636';
      dc.moveTo(txtX, txtY);
      dc.fillText(this.tPysicalName, txtX, txtY);
      dc.moveTo(txtX, txtY + this.rowHeight);
      dc.fillText(this.tLogicalName, txtX, txtY + this.rowHeight);

      tY = txtY + this.rowHeight*2;
      for(let i=0;i<this.cLineX.length;i++){
        dc.moveTo(drX + this.cLineX[i] + this.txtLineGap, tY);
        dc.fillText(this.cTitles[i], drX + this.cLineX[i] + this.txtLineGap, tY);
      }

      for(let i=0;i<this.cPysicalNames.length;i++){
        tY += this.rowHeight;
        if(this.cIsPks[i] == "Y"){
          dc.fillStyle = '#5555FF';
          dc.font      = 'bold 14px Tahoma';
        }else{
          dc.fillStyle = '#363636';
          dc.font      = 'normal 14px Tahoma';
        }
        dc.moveTo(drX + this.cLineX[0] + this.txtLineGap, tY);
        dc.fillText(this.cPysicalNames[i] , drX + this.cLineX[0] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[1] + this.txtLineGap, tY);
        dc.fillText(this.cLogicalNames[i] , drX + this.cLineX[1] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[2] + this.txtLineGap, tY);
        dc.fillText(this.cTypes[i]        , drX + this.cLineX[2] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[3] + this.txtLineGap, tY);
        dc.fillText(this.cLengths[i]      , drX + this.cLineX[3] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[4] + this.txtLineGap, tY);
        dc.fillText(this.cIsPks[i]        , drX + this.cLineX[4] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[5] + this.txtLineGap, tY);
        dc.fillText(this.cNullables[i]     , drX + this.cLineX[5] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[6] + this.txtLineGap, tY);
        dc.fillText(this.cDefaults[i]    , drX + this.cLineX[6] + this.txtLineGap, tY);
        dc.moveTo(drX + this.cLineX[7] + this.txtLineGap, tY);
        dc.fillText(this.cDescriptions[i] , drX + this.cLineX[7] + this.txtLineGap, tY);
      }
      //*******************************************************************************************
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    select : function (px, py){
      px = S2R_X(px);
      py = S2R_Y(py);
      if(this.px > px) return null;
      if(this.py > py) return null;
      if((this.px + this.width) < px) return null;
      if((this.py + this.height) < py) return null;
      this.ox = this.px;
      this.oy = this.py;
      let eventCheckInfo = new EventCheckResult();
      eventCheckInfo.clsName  = 'BiERDTable';
      eventCheckInfo.dataInfo = this.id;
      return eventCheckInfo;
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    moveTo : function (px, py){
      if(this.px != this.ox || this.py != this.oy){
        this.px = this.ox + px;
        this.py = this.oy + py;
        this.ox = this.px;
        this.oy = this.py;
      }
    },
    //*********************************************************************************************



    //*********************************************************************************************
    //
    //*********************************************************************************************
    moveView : function (px, py){
      this.px = this.ox + px;
      this.py = this.oy + py;
    }
    //*********************************************************************************************
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
//
//*************************************************************************************************
function BiRelly(sNode, eNode){
  var rtn = {
    id        : sNode.id + '_' + eNode.id,
    sObj      : sNode,
    eObj      : eNode,
    spX       : 0,
    spY       : 0,
    epX       : 0,
    epY       : 0,

    getJsonData : function(){
      let viewRelly = {
        id        : this.id,
        spX       : this.spX,
        spY       : this.spY,
        epX       : this.epX,
        epY       : this.epY,
      }
      return viewRelly;
    },

    draw      : function(dc, isSelected){
      let ssx = this.sObj.px + this.sObj.width   / 2;
      let ssy = this.sObj.py + this.sObj.height  / 2;
      let eex = this.eObj.px + this.eObj.width   / 2;
      let eey = this.eObj.py + this.eObj.height  / 2;
      this.spX = R2S_X(ssx);
      this.spY = R2S_Y(ssy);
      this.epX = R2S_X(eex);
      this.epY = R2S_Y(eey);

      let WB = Math.abs(this.epX - this.spX); // 큰 W
      let HB = Math.abs(this.epY - this.spY); // 큰 H
      let wp = this.eObj.width  / 2;          // 작은 w
      let hp = this.eObj.height / 2;          // 작은 h
      let axisVal = 0;
      let IntersectPoint = null;

      if(HB/WB < hp/wp){
        if(this.sObj.px < this.eObj.px){
          axisVal = this.eObj.px;
        }else{
          axisVal = this.eObj.px + this.eObj.width;
        }
        IntersectPoint = GetIntersectPoint( 
          new BasicPoint(ssx, ssy)
        , new BasicPoint(eex, eey)
        , new BasicPoint(axisVal, this.eObj.py)
        , new BasicPoint(axisVal, this.eObj.py+this.eObj.height)
        );
      }else{
        if(this.sObj.py < this.eObj.py){
          axisVal = this.eObj.py;
        }else{
          axisVal = this.eObj.py + this.eObj.height;
        }
        IntersectPoint = GetIntersectPoint (
          new BasicPoint(ssx, ssy)
        , new BasicPoint(eex, eey)
        , new BasicPoint(this.eObj.px, axisVal)
        , new BasicPoint(this.eObj.px+this.eObj.width, axisVal)
        )
      }

      dc.beginPath();
      if(isSelected){
        dc.lineWidth    = 4;
        dc.strokeStyle = '#fa9664';
      }else{
        dc.lineWidth = 3;
        dc.strokeStyle = '#0a0ac8';
      }
      dc.moveTo(this.spX, this.spY);
      dc.lineTo(this.epX, this.epY);
      dc.stroke();
      if(IntersectPoint != null){
        dc.moveTo(R2S_X(IntersectPoint.px) ,R2S_Y(IntersectPoint.py));
        dc.arc(R2S_X(IntersectPoint.px)  ,R2S_Y(IntersectPoint.py), 8, 0, 2 * Math.PI);
        dc.fill();
      }
    },
    select : function(px, py, gap){
      //px = S2R_X(px);
      //py = S2R_Y(py);

      let sx = this.spX;
      let ex = this.epX;
      let sy = this.spY;
      let ey = this.epY;
      if(sx > ex){
        sx = this.epX;
        ex = this.spX;
      }
      if(sy > ey){
        sy = this.epY;
        ey = this.spY;
      }

      if(px <= sx - gap) return null;
      if(px >= ex + gap) return null;
      if(py <= sy - gap) return null;
      if(py >= ey + gap) return null;
      let dist = getPL_Dist(this.spX, this.spY, this.epX, this.epY, px, py);

      if(dist <= gap){
        let eventCheckInfo = new EventCheckResult();
        eventCheckInfo.clsName  = 'BiRelly';
        eventCheckInfo.dataInfo = this.id;
        return eventCheckInfo;
      }else{
        return null;
      }
    },
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
// 두 점을 각각지나는 직선 두개의 교차점 구하기
//*************************************************************************************************
function GetIntersectPoint(AP1, AP2, BP1, BP2) 
{
  let t, s, under;
  under = (BP2.py-BP1.py)*(AP2.px-AP1.px)-(BP2.px-BP1.px)*(AP2.py-AP1.py);
  if(under==0) return null;

  let _t = (BP2.px-BP1.px)*(AP1.py-BP1.py) - (BP2.py-BP1.py)*(AP1.px-BP1.px);
  let _s = (AP2.px-AP1.px)*(AP1.py-BP1.py) - (AP2.py-AP1.py)*(AP1.px-BP1.px); 

  t = _t/under;
  s = _s/under; 

  if(t<0.0 || t>1.0 || s<0.0 || s>1.0) return null;
  if(_t==0 && _s==0) return null; 

  return new BasicPoint(AP1.px + t * (AP2.px-AP1.px), AP1.py + t * (AP2.py-AP1.py));
}

//*************************************************************************************************

/*
function EventCheckResult(){
  var rtn = {
    clsName  : null,    // Class Name
    vectInfo : null,    // Left, Top, Right, Bottom
    idxInfo  : null,    // 0, 1, 2, 3, 4
    idInfo   : null,    // Object ID
    dataInfo : null,    // Result Data
    msgInfo  : null,
    etcInfo  : null,
  };
  return rtn;
}
*/
//*************************************************************************************************
// 개별단위 메뉴 객체 : 내가 선택되었소~~ 하는걸 잘 리턴 해줘야 겠지?
// 메뉴는 좌표계의 영향을 받지 않는다. 즉, 모두 걍 스크린이고 메뉴도 스크린에 고정된다.
//*************************************************************************************************
function BiMenuButton(id, sx, sy, ex, ey){
  var rtn = {
    id : id,
    sx : sx,
    sy : sy,
    ex : ex,
    ey : ey,
    checkMenuButton : function (px, py){          // px, py : 스크린좌표계 값이 넘어온다. (리얼좌표계는 다루지 않는다)
      if(this.sx > px)  return null;
      if(this.sy > py)  return null;
      if(this.ex < px)  return null;
      if(this.ey < py)  return null;
      let eventCheckInfo      = new EventCheckResult();
      eventCheckInfo.clsName  = 'BiMenuButton';
      eventCheckInfo.dataInfo = this.id;
      return eventCheckInfo;
    },
  };
  return rtn;
}
//*************************************************************************************************



//*************************************************************************************************
// 메뉴 전체 객체 : 그려주고, 선택된거 리턴하는 그런일만 하는거
//*************************************************************************************************
function BiMenu(){
  var rtn = {
    LineColor     : '',
    LineWidth     : 2,
    BodyColor     : '',
    ActLineColor  : '',
    ActLineWidth  : 3,
    SelBodyColor  : '',
    Buttons       : [],
    drawAll       : function(dc, sx, sy, gap, vector){

    },
    checkMenuButton : function(px, py){
      for(let i=0;i<this.Buttons.length;i++){

      }
    }
  };
  return rtn;
}
//*************************************************************************************************