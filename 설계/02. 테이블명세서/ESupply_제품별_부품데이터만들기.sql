select * from esupply.part_master;
select * from esupply.product_part_list;
 /*********************************************************************************************/
 /* 최종적으로 제품별 핅요한 부품 리스트 조회 하는 쿼리 */
 /*********************************************************************************************/
 select pm.CLASS_ID
      , pm.PRODUCT_ID
      , pm.PRODUCT_NM
      , pm.PRICE
      , pm.WEIGHT
      , pm.SIZE_H
      , pm.SIZE_V
      , pm.SIZE_Z
      , pm.IMAGE 
      , pl.PART_NO 
      , pm2.PART_NM 
      , ifnull(pl.COUNT , 0) as COUNT
   from esupply.product_master pm
  inner join esupply.product_part_list pl on pm.CLASS_ID = pl.CLASS_ID and pm.PRODUCT_ID = pl.PRODUCT_ID 
  inner join esupply.part_master pm2   on pl.PART_NO = pm2.PART_NO 
  order by pm.CLASS_ID, pm.PRODUCT_ID, pl.PART_NO 
  ;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 1 */
/*********************************************************************************************/
insert into esupply.part_master ( PART_NO, PART_NM, PRICE, WEIGHT, SIZE_H, SIZE_V, SIZE_Z )
select 'DDI563_19830508_0140'	, '다이오드140ma' 	, 0, 0, 0, 0, 0 from dual union all
select 'DDI563_19830508_0150'	, '다이오드150ma' 	, 0, 0, 0, 0, 0 from dual union all
select 'DDI563_19830508_0160'	, '다이오드160ma' 	, 0, 0, 0, 0, 0 from dual union all
select 'CAF054GU8901X'			  , '콘덴서 X'			  , 0, 0, 0, 0, 0 from dual union all
select 'CAF054GU8901Y'			  , '콘덴서 Y'			  , 0, 0, 0, 0, 0 from dual union all
select 'CAF054GU8901Z'			  , '콘덴서 Z'			  , 0, 0, 0, 0, 0 from dual union all
select 'CAF054GU8901Z_777'		, '콘덴서 Z_확장'		, 0, 0, 0, 0, 0 from dual union all
select 'CWF054CC9900G'			  , '패쇄 루프 9900W'	, 0, 0, 0, 0, 0 from dual union all
select 'CWF054CC9800G'			  , '패쇄 루프 9800W'	, 0, 0, 0, 0, 0 from dual union all
select 'CWF054CC9700G'			  , '패쇄 루프 9700W'	, 0, 0, 0, 0, 0 from dual union all
select 'LF320AML23GAU'			  , '레이어 양쪽'		  , 0, 0, 0, 0, 0 from dual union all
select 'LL320AML23GAU'			  , '레이어 왼쪽'		  , 0, 0, 0, 0, 0 from dual union all
select 'LR320AML23GAU'			  , '레이어 오른쪽'		, 0, 0, 0, 0, 0 from dual;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 2 */
/*********************************************************************************************/
insert into esupply.product_part_list ( CLASS_ID, PRODUCT_ID, PART_NO, COUNT )
select 'AAAA'		    ,	'BBBB'					        , 'DDI563_19830508_0140', 1 from dual union all
select 'ABCD'		    ,	'ddd'					          , 'DDI563_19830508_0140', 2 from dual union all
select 'CAP_001'	  ,	'CAP_001_CERA_DW467823'	, 'DDI563_19830508_0140', 3 from dual union all
select 'CAP_002'	  ,	'CAP_002_TANT_RA578902'	, 'DDI563_19830508_0140', 4 from dual union all
select 'CCCC'		    ,	'WWWW'					        , 'DDI563_19830508_0140', 5 from dual union all
select 'classIdaa'	,	'prodIdfdsafd'			    , 'DDI563_19830508_0140', 6 from dual union all
select 'DIO_008'	  ,	'DIO_008_CDLRWB678354'	, 'DDI563_19830508_0140', 7 from dual union all
select 'DIO_120'	  ,	'DIO_120_DLCGBB999340'	, 'DDI563_19830508_0140', 8 from dual union all
select 'JJJJ'		    ,	'HHH'					          , 'DDI563_19830508_0140', 9 from dual union all
select 'TRN_362'	  ,	'TRN_362_DLCGBB999340'	, 'DDI563_19830508_0140', 10 from dual;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 3 */
/*********************************************************************************************/
insert into esupply.product_part_list ( CLASS_ID, PRODUCT_ID, PART_NO, COUNT )
select 'CAP_001'	,	'CAP_001_CERA_DW467823'	, 'CAF054GU8901Y', 3 from dual union all
select 'CAP_002'	,	'CAP_002_TANT_RA578902'	, 'CAF054GU8901Z', 4 from dual union all
select 'DIO_008'	,	'DIO_008_CDLRWB678354'	, 'CAF054GU8901Y', 7 from dual union all
select 'DIO_120'	,	'DIO_120_DLCGBB999340'	, 'CAF054GU8901X', 8 from dual union all
select 'TRN_362'	,	'TRN_362_DLCGBB999340'	, 'CAF054GU8901Y', 1 from dual;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 4 */
/*********************************************************************************************/
insert into esupply.product_part_list ( CLASS_ID, PRODUCT_ID, PART_NO, COUNT )
select 'CAP_001'	,	'CAP_001_CERA_DW467823'	, 'LF320AML23GAU', 2 from dual union all
select 'CAP_002'	,	'CAP_002_TANT_RA578902'	, 'LL320AML23GAU', 5 from dual union all
select 'DIO_008'	,	'DIO_008_CDLRWB678354'	, 'LF320AML23GAU', 9 from dual union all
select 'DIO_120'	,	'DIO_120_DLCGBB999340'	, 'LR320AML23GAU', 3 from dual union all
select 'TRN_362'	,	'TRN_362_DLCGBB999340'	, 'LR320AML23GAU', 2 from dual;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 5 */
/*********************************************************************************************/
insert into esupply.product_part_list ( CLASS_ID, PRODUCT_ID, PART_NO, COUNT )
select 'classIdaa'	,	'prodIdfdsafd'			, 'CWF054CC9900G', 3 from dual;
/*********************************************************************************************/


/*********************************************************************************************/
/* 가라데이터 만들기 6 */
/*********************************************************************************************/
insert into esupply.product_part_list ( CLASS_ID, PRODUCT_ID, PART_NO, COUNT )
select 'CAP_001'	,	'CAP_001_CERA_DW467823'	, 'CWF054CC9700G', 2 from dual union all
select 'CAP_002'	,	'CAP_002_TANT_RA578902'	, 'CWF054CC9700G', 2 from dual union all
select 'DIO_008'	,	'DIO_008_CDLRWB678354'	, 'CWF054CC9700G', 2 from dual union all
select 'DIO_120'	,	'DIO_120_DLCGBB999340'	, 'CWF054CC9800G', 2 from dual union all
select 'TRN_362'	,	'TRN_362_DLCGBB999340'	, 'CWF054CC9800G', 5 from dual;
/*********************************************************************************************/