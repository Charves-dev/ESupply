-- 2024.07.24 : ChangeTableName : product_out To order_out_good
RENAME TABLE esupply.product_out TO esupply.order_out_good;
ALTER TABLE esupply.order_out_good COMMENT='주문_출고_상품';


-- 2024.07.25 : product_master 테이블 칼럼추가
ALTER TABLE esupply.product_master ADD IMAGE varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '제품이미지';