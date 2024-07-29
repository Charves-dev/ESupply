CREATE TABLE `PRODUCT_MASTER` (
 `CLASS_ID` varchar(30) NOT NULL COMMENT '클레스_아이디',
 `PRODUCT_ID` varchar(30) NOT NULL COMMENT '제품_아이디',
 `PRODUCT_NM` varchar(150) NOT NULL COMMENT '제품_이름',
 `PRICE` varchar(10) DEFAULT null COMMENT '가격',
 `WEIGHT` varchar(10) DEFAULT null COMMENT '중량',
 `SIZE_H` varchar(10) DEFAULT null COMMENT '크기_가로',
 `SIZE_V` varchar(10) DEFAULT null COMMENT '크기_세로',
 `SIZE_Z` varchar(10) DEFAULT null COMMENT '크기_높이',
 PRIMARY KEY (`CLASS_ID`,`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='제품_마스터';

CREATE TABLE `GOOD` (
 `CLASS_ID` varchar(30) NOT NULL COMMENT '클레스_아이디',
 `PRODUCT_ID` varchar(30) NOT NULL COMMENT '제품_아이디',
 `SEREAL_NO` varchar(20) NOT NULL COMMENT '일련_번호',
 `MANUFACTURING_DTTM` varchar(14) NOT NULL COMMENT '제조_일시',
 `LOT_NO` varchar(4) NOT NULL COMMENT '제조_라인번호',
 PRIMARY KEY (`CLASS_ID`,`PRODUCT_ID`,`SEREAL_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='상품';

CREATE TABLE `GOOD_INVENTORY` (
 `CLASS_ID` varchar(30) NOT NULL COMMENT '클레스_아이디',
 `PRODUCT_ID` varchar(30) NOT NULL DEFAULT 0 COMMENT '제품_아이디',
 `COUNT` int(10) NOT NULL DEFAULT 0 COMMENT '재고',
 PRIMARY KEY (`CLASS_ID`,`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='상품_재고';

CREATE TABLE `PRODUCT_PART_LIST` (
 `CLASS_ID` varchar(30) NOT NULL COMMENT '클레스_아이디',
 `PRODUCT_ID` varchar(30) NOT NULL COMMENT '제품_아이디',
 `PART_NO` varchar(20) NOT NULL COMMENT '부품_번호',
 `COUNT` int(4) NOT NULL DEFAULT 1 COMMENT '부품_개수',
 PRIMARY KEY (`CLASS_ID`,`PRODUCT_ID`,`PART_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='제품_부품_목록';

CREATE TABLE `PART_MASTER` (
 `PART_NO` varchar(20) NOT NULL COMMENT '부품_번호',
 `PART_NM` varchar(100) NOT NULL COMMENT '부품_이름',
 `PRICE` int(10) NOT NULL COMMENT '가격',
 `WEIGHT` int(10) DEFAULT null COMMENT '중량',
 `SIZE_H` int(10) DEFAULT null COMMENT '크기_가로',
 `SIZE_V` int(10) DEFAULT null COMMENT '크기_세로',
 `SIZE_Z` int(10) DEFAULT null COMMENT '크기_높이',
 PRIMARY KEY (`PART_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='부품_마스터';

CREATE TABLE `ORDER_MASTER` (
 `ORDER_NO` varchar(30) NOT NULL COMMENT '주문_번호',
 `ORDER_DTTM` varchar(14) NOT NULL COMMENT '주문_일시',
 `COMPANY_ID` varchar(100) NOT NULL COMMENT '기업_아이디',
 `CUSTOM_ID` varchar(200) NOT NULL COMMENT '고객_아이디',
 `TOTAL_PRICE` int(10) NOT NULL COMMENT '총_가격',
 `PURCHASE` int(10) NOT NULL COMMENT '지불금액',
 `BILL_NO` varchar(12) COMMENT '선적_번호',
 `BILL_DTTM` varchar(14) COMMENT '선적_일시',
 `DLV_ADDR` varchar(300) COMMENT '배송_주소',
 `ARRIVE_YN` varchar(1) NOT NULL DEFAULT 'N' COMMENT '도착_여부',
 PRIMARY KEY (`ORDER_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='주문_마스터';

CREATE TABLE `ORDER_GOOD` (
 `ORDER_NO` varchar(30) NOT NULL COMMENT '주문_번호',
 `PRODUCT_ID` varchar(30) NOT NULL COMMENT '제품_아이디',
 `COUNT` int(10) NOT NULL COMMENT '제품_개수',
 PRIMARY KEY (`ORDER_NO`,`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='주문_상품';

CREATE TABLE `ACCOUNT_CUSTOMER` (
 `COMPANY_ID` varchar(100) NOT NULL COMMENT '기업_ID',
 `CUSTOM_ID` varchar(200) NOT NULL COMMENT '고객_ID',
 `CUSTOM_PW` varchar(256) NOT NULL COMMENT '고객_비밀번호',
 `CUSTOM_NM` varchar(100) NOT NULL COMMENT '고객_이름',
 `ADDR1` varchar(200) DEFAULT null COMMENT '주소1',
 `ADDR2` varchar(100) DEFAULT null COMMENT '주소2',
 `ADDR3` varchar(100) DEFAULT null COMMENT '주소3',
 `PHONE_NO` varchar(20) DEFAULT null COMMENT '전화번호',
 PRIMARY KEY (`COMPANY_ID`,`CUSTOM_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='계정_고객';

CREATE TABLE `ACCOUNT_ADMIN` (
 `COMPANY_ID` varchar(100) NOT NULL COMMENT '기업_ID',
 `ADMIN_ID` varchar(200) NOT NULL COMMENT '관리자_ID',
 `ADMIN_PW` varchar(256) NOT NULL COMMENT '관리자_비밀번호',
 `ADMIN_NM` varchar(100) NOT NULL COMMENT '관리자_이름',
 `EMP_NO` varchar(20) NOT NULL COMMENT '사번',
 `PHONE_NO` varchar(20) DEFAULT null COMMENT '전화번호',
 PRIMARY KEY (`COMPANY_ID`,`ADMIN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='계정_관리자';

CREATE TABLE `ORDER_OUT_GOOD` (
 `PRODUCT_ID` varchar(30) NOT NULL COMMENT '제품_아이디',
 `SEREAL_NO` varchar(20) NOT NULL COMMENT '일련_번호',
 PRIMARY KEY (`PRODUCT_ID`,`SEREAL_NO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='주문_출고_상품';

CREATE TABLE `COMM_CODE_GROUP` (
 `GROUP_ID` varchar(10) NOT NULL COMMENT '그룹_아이디',
 `GROUP_NM` varchar(50) NOT NULL COMMENT '그룹_이름',
 `USE_YN` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용_여부',
 `DESCRIPTION` varchar(300) DEFAULT null COMMENT '설명',
 `REG_DTTM` varchar(14) NOT NULL DEFAULT DATE_FORMAT(CURRENT_TIMESTAMP(), '%Y%m%d%H%i%s') COMMENT '등록_일시',
 PRIMARY KEY (`GROUP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통_코드_그룹';

CREATE TABLE `COMM_CODE` (
 `GROUP_ID` varchar(10) NOT NULL COMMENT '그룹_아이디',
 `CODE_ID` varchar(10) NOT NULL COMMENT '코드_아이디',
 `CODE_NM` varchar(50) NOT NULL COMMENT '코드_이름',
 `USE_YN` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용_여부',
 `DESCRIPTION` varchar(200) DEFAULT null COMMENT '설명',
 `REG_DTTM` varchar(14) NOT NULL DEFAULT DATE_FORMAT(CURRENT_TIMESTAMP(), '%Y%m%d%H%i%s') COMMENT '등록_일시',
 PRIMARY KEY (`GROUP_ID`,`CODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통_코드';

