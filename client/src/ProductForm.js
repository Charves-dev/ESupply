import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [image, setImage] = useState(null);
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [sizeH, setSizeH] = useState('');
  const [sizeV, setSizeV] = useState('');
  const [sizeZ, setSizeZ] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('class_id', classId);
    formData.append('product_id', productId);
    formData.append('product_nm', productName);
    formData.append('price', price);
    formData.append('weight', weight);
    formData.append('size_h', sizeH);
    formData.append('size_v', sizeV);
    formData.append('size_z', sizeZ);

    try {
      const response = await axios.post('http://localhost:1092/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>제품 등록</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="class_id" value={classId} onChange={(e) => setClassId(e.target.value)} placeholder="Class ID" />
        <input type="text" name="product_id" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Product ID" />
        <input type="text" name="product_nm" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" />
        <input type="text" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <input type="text" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
        <input type="text" name="size_h" value={sizeH} onChange={(e) => setSizeH(e.target.value)} placeholder="Height" />
        <input type="text" name="size_v" value={sizeV} onChange={(e) => setSizeV(e.target.value)} placeholder="Vertical Size" />
        <input type="text" name="size_z" value={sizeZ} onChange={(e) => setSizeZ(e.target.value)} placeholder="Depth" />
        <input type="file" name="image" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {previewUrl && (
        <div>
          <h2>이미지 미리 보기</h2>
          <img style={{width: 'auto', height: 500}} src={previewUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default ProductForm;
