-- 2024.07.24 : ChangeTableName : product_out To order_out_good
RENAME TABLE esupply.product_out TO esupply.order_out_good;
ALTER TABLE esupply.order_out_good COMMENT='주문_출고_상품';