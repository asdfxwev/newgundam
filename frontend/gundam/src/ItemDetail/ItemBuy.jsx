import React, { useState, useEffect, useRef } from 'react';
import './ItemDetail.css';
import ItemBuyCartList from './ItemBuyCartList';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLogin } from '../Login/LoginStatus';
import { apiCall } from '../service/apiService';
import { API_BASE_URL } from "../service/app-config";

const ItemBuy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, count, imgList } = location.state || {};
    const [total, setTotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { loginInfo, isLoggedIn, onLogout } = useLogin();
    const [showUser, setShowUser] = useState(true);
    const [checkedTrueItems, setCheckedTrueItems] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryUser, setDeliveryUser] = useState('');
    const [deliveryPhone, setDeliveryPhone] = useState('');
    const [deliverDtlAddress, setDeliverDtlAddress] = useState('');
    const [userDetails, setUserDetails] = useState({});
    // const [user_id, setUser_id] = useState(''); // token 값으로 select한 user_id정보
    const [userInfo, setUserInfo] = useState(''); // user_id값으로 user 정보 get
    const [payMethod, setPayMethod] = useState('신용카드');
    const addressKakaoRef = useRef(null);
    // const user_id = JSON.parse(sessionStorage.getItem('userId')).user_id;
    // 최초 로드 시 로그인true면 토큰값으로 user정보 가져와야하는 부분
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         let url = `/user/token_info`;

    //         const response = apiCall(url, 'POST', null, loginInfo)
    //             .then((response) => {
    //                 // sessionStorage.setItem("userId", JSON.stringify(response));  // 세션에 로그인 정보 저장
    //                 setUser_id(response);

    //             }).catch((err) => {
    //                 onLogout(); // 로그아웃 상태로 처리
    //                 alert("사용자 정보를 찾을수 없습니다. 다시 로그인 하세요.");
    //             });
    //     }

    // }, [isLoggedIn, loginInfo, onLogout]);

    // useEffect(() => {
    //     if (user_id && user_id.length > 0) {
    //         let url = `/user/user_info`;

    //         const data = { user_id: user_id };

    //         const response = apiCall(url, 'POST', data, null)
    //             .then((response) => {
    //                 // sessionStorage.setItem("userInfo", JSON.stringify(response));  // 세션에 로그인 정보 저장
    //                 setUserInfo(response);
    //             });
    //     }
    // }, [user_id]); // user_id 값이 변경될 때 실행되도록 설정

    const formatNumber = (number) => number.toLocaleString('ko-KR');

    const user_id = JSON.parse(sessionStorage.getItem('userInfo')).user_id;
    // console.log("item = " + item);
    // console.log("imgList = " + imgList);
    // console.log("count = " + count);

    useEffect(() => {
        if (item && count) {
            const initialTotal = item.price * count;
            setTotal(initialTotal);
            setTotalQuantity(count);
        }
    }, [item, count]);

    // 유저정보가져오기
    // useEffect(() => {
    //     const fetchUserDetails = async () => {
    //         try {
    //             const user_id = JSON.parse(sessionStorage.getItem('userInfo')).user_id;
    //             const response = await axios.get(`${API_BASE_URL}/cart/user`, {
    //                 params: { user_id } // 쿼리 파라미터로 user_id 전달
    //             });
    //             console.log(response.data);
    //             setUserDetails(response.data);
    //         } catch (error) {
    //             console.error('사용자 정보 로드 중 오류 발생:', error);
    //         }
    //     };

    //     fetchUserDetails();
    // }, []);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const tokenId = JSON.parse(sessionStorage.getItem('loginInfo'))
                console.log(tokenId)
                const response = await axios.get(`${API_BASE_URL}/cart/user`, {
                     params: { tokenId } // 쿼리 파라미터로 user_id 전달
                })
                setUserDetails(response.data);
            } catch (error) {
                console.error('사용자 정보 로드 중 오류 발생:', error);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

        script.onload = () => {
            if (addressKakaoRef.current) {
                addressKakaoRef.current.addEventListener("click", () => {
                    new window.daum.Postcode({
                        oncomplete: (data) => {
                            setDeliveryAddress(data.address);
                        }
                    }).open();
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            if (addressKakaoRef.current) {
                addressKakaoRef.current.removeEventListener("click", () => { });
            }
            document.body.removeChild(script);
        };
    }, [showUser]);

    const deliveryChange = () => {
        setShowUser(prev => !prev);
    };

    const handleOrder = async () => {

        

        // 배송 정보가 없으면 경고
        if (!showUser && (!deliveryUser || !deliveryPhone || !deliveryAddress)) {
            alert('배송 정보를 입력해주세요.');
            return;
        }

        try {
            // 유저의 주문 정보 생성
            const orderCountResponse = await axios.get(`${API_BASE_URL}/cart/${user_id}`);
            console.log('ordercountresponse : ', orderCountResponse);
            const orderCount = orderCountResponse.data.length;
            console.log('ordercount : ', orderCount);
            // 체크된 아이템만 포함
            const allItemsToBuy = checkedTrueItems.length > 0 ? checkedTrueItems : [];

            // 배송 정보 설정
            const deliveryInfo = showUser ? {
                deliveryUser: userDetails.user_name,
                deliveryPhone: userDetails.phone_num,
                deliveryAddress: userDetails.address,
                deliverDtlAddress: userDetails.dtl_address
            } : {
                deliveryUser,
                deliveryPhone,
                deliveryAddress,
                deliverDtlAddress
            };

            // 주문 데이터 생성
            const orderDto = {
                user_id: user_id,
                postcode: userDetails.postcode,
                oritem_address: deliveryInfo.deliveryAddress,
                oritem_dtladdress: deliveryInfo.deliverDtlAddress,
                oritem_name: deliveryInfo.deliveryUser, // 수령자 정보
                oritem_number: deliveryInfo.deliveryPhone, // 연락처 정보
                pay_method: payMethod,
                oritem_payment: total,
                oritem_count: allItemsToBuy.length, // 체크된 아이템의 수량
                items: allItemsToBuy.map(item => ({
                    pro_id: item.pro_id,
                    oritem_quan: item.cart_quantity // 각 아이템의 수량 추가
                }))
            };

            console.log('orderdto : ', orderDto);
            // 주문 정보를 백엔드로 전송
            await axios.post(`${API_BASE_URL}/api/orders`, orderDto);
            alert('결제가 완료되었습니다.');
            navigate('../Order');
        } catch (error) {
            console.error('결제 처리 중 오류 발생:', error);
            alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="buy_main_box">
            <div className="buy_titlebar">
                <h1>주문결제</h1>
            </div>
            <div className="item_detail_main">
                <div className='detail_left_box'>
                    <div className="buy_left_subtitle">
                        <div className="subtitle_left"><h3>상품 정보</h3></div>
                    </div>
                    <ItemBuyCartList
                        item={item}
                        imgList={imgList}
                        count={count}
                        setTotal={setTotal}
                        setTotalQuantity={setTotalQuantity}
                        setCheckedTrueItems={setCheckedTrueItems} // 체크된 아이템을 설정할 수 있도록 props 추가
                    />
                </div>

                <div className='detail_right_box'>
                    <div className='right_inner'>
                        <div className='buy_right_subtitle'>
                            <h3>주문자 정보</h3>
                            <button className='delivery_change_btn' onClick={deliveryChange}>배송지 변경</button>
                        </div>

                        <div className='buy_item_info underline'>
                            {showUser ? (
                                <div id='user' className='userinfo'>
                                    <p>주문자</p>
                                    <p>{userDetails.user_name}</p>
                                    <p>연락처</p>
                                    <p>{userDetails.phone_num}</p>
                                    <p>e-Mail</p>
                                    <p>{userDetails.email}</p>
                                    <p>배송지</p>
                                    <span className='buy_user_address_box'>&nbsp;&nbsp;주소 : {userDetails.address}</span>
                                    <span className='buy_user_address_boxs'>&nbsp;&nbsp;상세주소 : {userDetails.dtl_address}</span>

                                </div>
                            ) : (
                                <div id='delivery' className='delivery_info'>
                                    <p>수령자</p>
                                    <input type='text' name='delivery_user' placeholder='수령자를 입력하세요.'
                                        onChange={(e) => setDeliveryUser(e.target.value)} maxLength={8} />
                                    <p>연락처</p>
                                    <input type='text' name='delivery_phone' placeholder='연락처를 입력하세요.'
                                        onChange={(e) => setDeliveryPhone(e.target.value)} maxLength={11} />
                                    <p>배송지</p>
                                    <p className='buy_address_search'>
                                        <button id='address_kakao' className='address_search_btn' ref={addressKakaoRef}>주소검색</button>
                                    </p>
                                    <input type='text' name='delivery_address' className='buy_delivery_address'
                                        placeholder='주소를 입력하세요.' value={deliveryAddress}
                                        readOnly />
                                    <p>상세주소</p>
                                    <input type='text' name='delivery_dtladdress' placeholder='상세주소를 알려주세요.'
                                        onChange={(e) => setDeliverDtlAddress(e.target.value)}  />
                                </div>
                            )}
                        </div>
                        <div className='buy_right_subtitle'><h3>결제 수단</h3></div>
                        <div className="pay_method_box underline">
                            <input type="radio" name="pay_method" value="신용카드" id="card"
                                checked={payMethod === "신용카드"}
                                onChange={() => setPayMethod('신용카드')} />
                            <label htmlFor="card">신용카드</label>
                            <input type="radio" name="pay_method" value="계좌이체" id="transfer"
                                checked={payMethod === "계좌이체"}
                                onChange={() => setPayMethod('계좌이체')} />
                            <label htmlFor="transfer">계좌이체</label>
                            <input type="radio" name="pay_method" value="휴대폰결제" id="phone"
                                checked={payMethod === "휴대폰결제"}
                                onChange={() => setPayMethod('휴대폰결제')} />
                            <label htmlFor="phone">휴대폰결제</label>
                        </div>

                        <div className='item_count underline'>
                            <div className='count_left_box font_medium'>총 결제 금액</div>
                            <div className='count_right_box'>
                                <div className='total_price'>{formatNumber(total)} 원</div>
                            </div>
                        </div>
                        <div className='buy_button_box'>
                            <button className='submit_btn' onClick={handleOrder}>결제하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemBuy;
