import React, { useEffect } from 'react';
import GoodsForm from './GoodsForm';
import GoodsTable from './GoodsTable';
import ProductForm from './ProductForm';
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
    navigate('/GoodsForm');
  }, [navigate]);

  return <div><GoodsForm /></div>;
};

const GoodsTableWrapper = ({ navigate }) => {
  useEffect(() => {
    navigate('/GoodsTable');
  }, [navigate]);

  return <div><GoodsTable /></div>;
};

const ProductFormWrapper = ({ navigate }) => {
  useEffect(() => {
    navigate('/ProductForm');
  }, [navigate]);

  return <div><ProductForm /></div>;
};
