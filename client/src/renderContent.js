import React, { useEffect } from 'react';
import PageNation from './PagiNation';

export const renderContent = (currentView, components, navigate) => {
  const { searchContent, productRender } = components;

  switch (currentView) {
    case 'productList':
      return (
        <>
          {searchContent()}
          <PageNation data={productRender()} itemsPerPage={5} />
        </>
      );

    case 'goodsForm':
      return (
        <GoodsFormWrapper navigate={navigate} />
      );

    case 'goodsTable':
      return (
        <GoodsTableWrapper navigate={navigate} />
      );

    case 'g_drop_down':
      return (
        <GoodsFormWrapper navigate={navigate} />
      );

    case 'productForm':
      return (
        <ProductFormWrapper navigate={navigate} />
      );

    case 'p_drop_down':
      return (
        <ProductFormWrapper navigate={navigate} />
      );

    default:
      return null;
  }
};

const GoodsFormWrapper = ({ navigate }) => {
  useEffect(() => {
    navigate('/goodsForm');
  }, [navigate]);  
};

const GoodsTableWrapper = ({ navigate }) => {
  useEffect(() => {
    navigate('/goodsTable');
  }, [navigate]);  
};

const ProductFormWrapper = ({ navigate }) => {
  useEffect(() => {
    navigate('/productForm');
  }, [navigate]);  
};
