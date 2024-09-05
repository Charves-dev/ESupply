-- 2024.07.24 : ChangeTableName : product_out To order_out_good
RENAME TABLE esupply.product_out TO esupply.order_out_good;
ALTER TABLE esupply.order_out_good COMMENT='주문_출고_상품';


-- 2024.07.25 : product_master 테이블 칼럼추가
ALTER TABLE esupply.product_master ADD IMAGE varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '제품이미지';


-- 2024.07.29 : hyosungtotal 송장번호 체계 설정으로 인한 송장번호 칼럼 사이즈 변경
ALTER TABLE hyosungtotal.DELIVERY_REQUEST MODIFY COLUMN BILL_NO varchar(14);
ALTER TABLE hyosungtotal.DELIVERY_ITEMS MODIFY COLUMN BILL_NO varchar(14);
ALTER TABLE hyosungtotal.DELIVERY_INFO MODIFY COLUMN BILL_NO varchar(14);
ALTER TABLE hyosungtotal.DELIVERY_SECTIONS MODIFY COLUMN BILL_NO varchar(14);


-- 2024.07.29 : esupply 공통코드 테이블 추가
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

-- 2024.07.29 : esupply 공통코드에 클레스 코드 데이터 등록
insert into comm_code_group (GROUP_ID, GROUP_NM) values ('CLASS', '제품그룹(CLASS)');

insert into comm_code ( GROUP_ID, CODE_ID, CODE_NM) 
select 'CLASS',	'CAP_001',	'콘덴서_001' from dual union all
select 'CLASS',	'CAP_002',	'콘덴서_002' from dual union all
select 'CLASS',	'DIO_008',	'다이오드_008' from dual union all
select 'CLASS',	'DIO_120',	'다이오드_120' from dual union all
select 'CLASS', 'TRN_362',	'트랜지스터_362' from dual

-- 2024.07.29 : esupply 공통코드에 판매구분 등록
insert into comm_code_group ( GROUP_ID, GROUP_NM ) values ('OUT_TYPE', '출고_구분');
insert into comm_code ( GROUP_ID, CODE_ID, CODE_NM )
select 'OUT_TYPE', 'SALE', '판매_출고' from dual union all
select 'OUT_TYPE', 'DISPOSE', '폐기_처분' from dual

-- 2024.07.29 : esupply 상품 출고 테이블에 출고구분 칼럼 추가
ALTER TABLE order_out_good ADD COLUMN `OUT_TYPE` VARCHAR(10) DEFAULT NULL COMMENT '출고_구분';


-- 2024.07.29 : esupply 오타로 인한 칼럼명 수정 및 칼럼 추가
ALTER TABLE good CHANGE COLUMN SEREAL_NO SERIAL_NO VARCHAR(20);
alter table order_out_good change column SEREAL_NO SERIAL_NO VARCHAR(20);
alter table order_out_good add column ORDER_NO varchar(30) default null COMMENT '주문_번호';


-- 2024.07.30 : esupply 공통_파일 테이블 추가
CREATE TABLE `COMM_FILES` (
 `FILE_ID` int(10) NOT NULL AUTO_INCREMENT COMMENT '파일_아이디',
 `TABLE_NM` varchar(40) NOT NULL COMMENT '테이블_이름',
 `ORIGIN_NM` varchar(200) NOT NULL COMMENT '오리지널_이름',
 `STORE_NM` varchar(100) NOT NULL COMMENT '저장된_이름',
 PRIMARY KEY (`FILE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통_파일';


-- 2024.07.31 : esupply product_master 테이블 수정
-- 업로드된 파일 정보는 comm_files테이블에 있고, product_master.IMAGE칼럼은 comm_files테이블의 FILE_ID를 가진다.
alter table product_master modify column IMAGE int(10) COMMENT '이미지파일';    

-- 2024.08.10 : charves user_account 테이블의 COMPANY_CD를 COMPANY_ID로 변경
ALTER TABLE charves.user_account CHANGE COMPANY_CD COMPANY_ID varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'charves' NOT NULL COMMENT '업체_아이디';

-- 2024.08.10 : charves user_account 테이블에 테스트용 데이터 만들기
insert into charves.user_account (USER_ID,USER_PW,USER_NM,USER_LEVEL,COMPANY_ID,DESCRIPTION)
values ( 'CSN-ah22', '26764550', '최선아', '100', 'esupply', '(주)선아전자_사장님' );
insert into charves.user_account (USER_ID,USER_PW,USER_NM,USER_LEVEL,COMPANY_ID,DESCRIPTION)
values ( 'charves', '1369(82)', '손윤석', '1', 'charves', '(주)차베스전기 말단사원' );

-- 2024.08.10 : charves company_info 테이블에 테스트용 데이터 만들기
insert into charves.company_info (COMPANY_ID,COMPANY_NM,MANAGER_NM,MANAGER_TEL,ADDRESS,LATITUDE,LONGITUDE)
values ('esupply', '(주)선아전자', '최선아', '010-2676-4550', '경기도 안양시 어딘가겠져? ㅋ', 37.3897, 126.9533556);
insert into charves.company_info (COMPANY_ID,COMPANY_NM,MANAGER_NM,MANAGER_TEL,ADDRESS,LATITUDE,LONGITUDE)
values ('charves', '(주)차베스전기', '손윤석', '010-6582-0385', '서울 관악구 난곡로 72길 16 4층 401호', 37.47538611, 126.9538444);

-- 2024.08.14 : charves 시퀀스 생성 (주문번호 채번을 위한 시퀀스)
CREATE OR REPLACE SEQUENCE `seqOrder` start with 1 minvalue 1 maxvalue 9999999999 increment by 1 cache 1000 cycle ENGINE=InnoDB


-- 2024.08.26 : charves 제품, 상품 등록
insert into charves.product_master(PRODUCT_ID, PRODUCT_NM, WEIGHT, SIZE_H, SIZE_V, SIZE_Z, PRICE)
select 'TRAN-0032-2847-72640', '트랜지스터', 2.3, 1,1,1, 900 from dual union all
select 'LDIO-2314-4562-82939', '광다이오드', 2.3, 1,1,1, 900 from dual union all
select 'RAMD-2222-6666-75588', '어스LEG', 2.3, 1,1,1, 900 from dual union all
select 'DDRM-3332-2333-74567', 'DDR게이트', 2.3, 1,1,1, 900 from dual union all
select 'JIND-4623-2854-90742', '베어링', 2.3, 1,1,1, 900 from dual union all
select 'ROUT-2839-3374-94847', '라우터', 2.3, 1,1,1, 900 from dual union all
select 'CAPA-7843-4536-27384', '카파푸어', 2.3, 1,1,1, 900 from dual union all
select 'THPD-4565-1526-46375', '써멀패드', 2.3, 1,1,1, 900 from dual;

insert into charves.goods (PRODUCT_ID, SERIAL_NO, MANUFACTURING_DTTM, LOT_NO)
select 'TRAN-0032-2847-72640', 'TRAN-20240826-000002', '20240826185502', 'R3-32' from dual union all
select 'TRAN-0032-2847-72640', 'TRAN-20240826-000003', '20240826185502', 'R3-32' from dual union all
select 'TRAN-0032-2847-72640', 'TRAN-20240826-000004', '20240826185502', 'R3-32' from dual union all
select 'TRAN-0032-2847-72640', 'TRAN-20240826-000005', '20240826185502', 'R3-32' from dual union all
select 'LDIO-2314-4562-82939', 'LDIO-20240826-000001', '20240826185504', 'G3-72' from dual union all
select 'LDIO-2314-4562-82939', 'LDIO-20240826-000002', '20240826185505', 'G3-72' from dual union all
select 'LDIO-2314-4562-82939', 'LDIO-20240826-000003', '20240826185506', 'G3-72' from dual union all
select 'LDIO-2314-4562-82939', 'LDIO-20240826-000004', '20240826185507', 'G3-72' from dual union all
select 'LDIO-2314-4562-82939', 'LDIO-20240826-000005', '20240826185508', 'G3-72' from dual union all
select 'DDRM-3332-2333-74567', 'DDRM-20240826-000001', '20240826185508', 'G3-72' from dual union all
select 'DDRM-3332-2333-74567', 'DDRM-20240826-000002', '20240826185508', 'G3-72' from dual union all
select 'DDRM-3332-2333-74567', 'DDRM-20240826-000003', '20240826185508', 'F9-72' from dual union all
select 'CAPA-7843-4536-27384', 'CAPA-20240826-000001', '20240826185508', 'F1-10' from dual union all
select 'CAPA-7843-4536-27384', 'CAPA-20240826-000002', '20240826185508', 'R5-36' from dual union all
select 'CAPA-7843-4536-27384', 'CAPA-20240826-000003', '20240826185508', 'R1-27' from dual union all
select 'THPD-4565-1526-46375', 'THPD-20240826-000001', '20240826185508', 'R4-22' from dual union all
select 'THPD-4565-1526-46375', 'THPD-20240826-000002', '20240826185508', 'R4-11' from dual union all
select 'THPD-4565-1526-46375', 'THPD-20240826-000003', '20240826185508', 'R4-15' from dual;
;
commit;


-- 2024.09.05 : esupply 주문번호처리를 위한 시퀀스 등록
CREATE OR REPLACE SEQUENCE esupply.seqorder 
    start with 1 minvalue 1 
 maxvalue 99999999 
increment by 1 cache 1000 cycle ENGINE=InnoDB;

