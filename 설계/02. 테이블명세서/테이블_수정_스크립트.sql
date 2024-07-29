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