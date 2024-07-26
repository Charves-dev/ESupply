CREATE TABLE `CENTER_INFO` (
 `CENTER_ID` varchar(20) NOT NULL COMMENT '센터_아이디',
 `CENTER_NM` varchar(100) NOT NULL COMMENT '센터_이름',
 `LATITUDE` double(11,8) DEFAULT null COMMENT '위도',
 `LONGITUDE` double(11,8) DEFAULT null COMMENT '경도',
 `DIRECTOR_EMPNO` varchar(20) DEFAULT null COMMENT '센터장_사번',
 `ADDRESS` varchar(250) DEFAULT null COMMENT '주소',
 `USE_YN` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용_여부',
 PRIMARY KEY (`CENTER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='센터_정보';

CREATE TABLE `DELIVERY_INFO` (
 `BILL_NO` varchar(12) NOT NULL COMMENT '송장_번호',
 `BILL_DTTM` varchar(14) COMMENT '송장_일시',
 `CUR_POS` varchar(20) COMMENT '현재_위치',
 `START_ADDR` varchar(300) COMMENT '시작_주소',
 `END_ADDR` varchar(300) COMMENT '종료_주소',
 `COLLECTOR_NM` varchar(50) COMMENT '집화_담당자_이름',
 `COLLECTOR_TEL` varchar(20) COMMENT '집화_담당자_전화',
 PRIMARY KEY (`BILL_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='배송_정보';

CREATE TABLE `DELIVERY_REQUEST` (
 `REQUEST_ID` varchar(20) NOT NULL COMMENT '요청_ID',
 `REQUEST_DTTM` varchar(14) NOT NULL COMMENT '요청_일시',
 `START_ADDR` varchar(300) NOT NULL COMMENT '시작_주소',
 `START_NM` varchar(150) COMMENT '시작_이름',
 `END_ADDR` varchar(300) NOT NULL COMMENT '종료_주소',
 `END_NM` varchar(150) COMMENT '종료_이름',
 `DLV_TITLE` varchar(100) NOT NULL COMMENT '배송_타이틀',
 `BILL_NO` varchar(12) DEFAULT null COMMENT '송장_번호',
 PRIMARY KEY (`REQUEST_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='배송_의뢰';

CREATE TABLE `DELIVERY_ITEMS` (
 `REQUEST_ID` varchar(20) NOT NULL COMMENT '요청_ID',
 `SEQ` int(4) NOT NULL COMMENT '일련번호',
 `ITEM_NM` varchar(150) NOT NULL COMMENT '항목_이름',
 `ITEM_COUNT` int(4) NOT NULL DEFAULT 1 COMMENT '항목_개수',
 `BILL_NO` varchar(12) DEFAULT null COMMENT '송장_번호',
 PRIMARY KEY (`REQUEST_ID`,`SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='배송_항목들';

CREATE TABLE `DELIVERY_SECTIONS` (
 `BILL_NO` varchar(12) NOT NULL COMMENT '송장_번호',
 `SEQ` int(4) NOT NULL COMMENT '일련번호',
 `CENTER_ID` varchar(20) NOT NULL COMMENT '센터_아이디',
 `OFF_PERSON_NM` varchar(50) DEFAULT null COMMENT '하차_담당자_이름',
 `OFF_PERSON_TEL` varchar(20) DEFAULT null COMMENT '하차_담당자_전화',
 `OFF_DTTM` varchar(14) DEFAULT null COMMENT '하차_일시',
 `ON_PERSON_NM` varchar(50) DEFAULT null COMMENT '상차_담당자_이름',
 `ON_PERSON_TEL` varchar(20) DEFAULT null COMMENT '상차_담당자_전화',
 `ON_DTTM` varchar(14) DEFAULT null COMMENT '상차_일시',
 PRIMARY KEY (`BILL_NO`,`SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='배송_구간 (ROUTER에의해 자동으로 생성된다)';

CREATE TABLE `INSA_INFO` (
 `EMP_NO` varchar(20) NOT NULL COMMENT '사원_번호',
 `EMP_NM` varchar(100) NOT NULL COMMENT '사원_이름',
 `TEL` varchar(20) DEFAULT null COMMENT '전화번호',
 `ADDR1` varchar(200) DEFAULT null COMMENT '주소1',
 `ADDR2` varchar(100) DEFAULT null COMMENT '주소2',
 `POSITION_ID` varchar(10) DEFAULT null COMMENT '직책_아이디',
 `RANK_ID` varchar(10) DEFAULT null COMMENT '직급_아이디',
 PRIMARY KEY (`EMP_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='인사_정보';

CREATE TABLE `COM_CODE_GROUP` (
 `GROUP_ID` varchar(10) NOT NULL COMMENT '그룹_아이디',
 `GROUP_NM` varchar(50) NOT NULL COMMENT '그룹_이름',
 `USE_YN` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용_여부',
 `REG_DTTM` varchar(14) NOT NULL COMMENT '등록_일시',
 `REG_EMP_NO` varchar(20) DEFAULT null COMMENT '등록_사원_번호',
 `DESCRIPTION` varchar(200) DEFAULT null COMMENT '설명',
 PRIMARY KEY (`GROUP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통_코드_그룹';

CREATE TABLE `COM_CODE` (
 `GROUP_ID` varchar(10) NOT NULL COMMENT '그룹_아이디',
 `CODE_ID` varchar(10) NOT NULL COMMENT '코드_아이디',
 `CODE_NM` varchar(50) NOT NULL COMMENT '코드_이름',
 `USE_YN` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용_여부',
 `REG_DTTM` varchar(14) NOT NULL COMMENT '등록_일시',
 `REG_EMP_NO` varchar(20) DEFAULT null COMMENT '등록_사원_번호',
 PRIMARY KEY (`GROUP_ID`,`CODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통_코드';

