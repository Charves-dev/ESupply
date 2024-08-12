import React, { useState, useEffect } from "react";
import './styles/Common.css'

const PageNation = ({data, itemsPerPage}) => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentData, setCurrentData] = useState([]); // 현재 페이지의 데이터 상태
  const [pageNumbers, setPageNumbers] = useState([]); // 페이지 번호 상태

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getCurrentPage = (data, currentPage, itemsPerPage) => {
    // 시작 인덱스 구하기
    const startIndex = (currentPage -1) * itemsPerPage; // index시작은 0부터이므로 -1 처리 ex.(2-1) * 10 = 10 부터 시작
    // 마지막 인덱스 구하기
    const endIndex = currentPage * itemsPerPage; // ex.2 * 10 = 20 이 끝
    let currentData = [];
    // 렌더링될 범위 만큼 리턴
    for (let i = startIndex; i < endIndex; i++) {
      if(data[i] !== undefined){
        currentData.push(data[i]);
      }
    }
    return currentData;
  }

  useEffect(() => {
    setCurrentData(getCurrentPage(data, currentPage, itemsPerPage));
    // 페이지 번호 생성
    const newPageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      newPageNumbers.push(i);
    }
    setPageNumbers(newPageNumbers);
  }, [data, currentPage, itemsPerPage, totalPages]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return(
    <>
      <ul className="thumb-list row-line2">
        {currentData.map((item, index) => (
          <li key={index} className="mt32 mb32"> {item} </li>
        ))}
      </ul>

      <div className="pageNaition mt66 flex a_i_center j_c_center">
        {/* 이전 페이지 버튼 */}
        <span
          className="mr18"
          onClick={() => totalPages > 1 && currentPage !== 1 ? handlePageChange(currentPage - 1) : ''}
          style={{
            cursor: currentPage > 1 ? 'pointer' : 'default',
            color: currentPage > 1 ? 'black' : '#a9a9a9'
          }}
        >
          &lt;
        </span>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((number) => (
          <span
            key={number}
            onClick={() => handlePageChange(number)}
            style={{
              cursor: 'pointer',
              padding: '5px',
              margin: '0 2px',
              color: number === currentPage ? '#000' : '#a9a9a9',
            }}
          >
            {number}
          </span>
        ))}

        {/* 다음 페이지 버튼 */}
        <span
          className="ml18"
          onClick={() => totalPages > 1  && currentPage !== totalPages ? handlePageChange(currentPage + 1) : ''}
          style={{
            cursor: currentPage < totalPages ? 'pointer' : 'default',
            color: currentPage < totalPages ? 'black' : '#a9a9a9'
          }}
        >
          &gt;
        </span>
      </div>
    </>
  )
}

export default PageNation;