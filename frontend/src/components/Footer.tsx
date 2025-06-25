import React from 'react';
import { Row, Col } from 'antd';
import { FacebookFilled, YoutubeFilled, InstagramFilled } from '@ant-design/icons';

const paymentIcons = [
  '/media/payment/unionpay.png',
  '/media/payment/visa.png',
  '/media/payment/mastercard.png',
  '/media/payment/jcb.png',
  '/media/payment/paypal.png',
  '/media/payment/amex.png',
  '/media/payment/applepay.png',
  '/media/payment/googlepay.png',
  '/media/payment/alipay.png',
];

const Footer = () => (
  <footer style={{ background: '#fff', borderTop: '1px solid #eee', marginTop: 64, padding: '40px 0 0 0' }}>
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
      <Row gutter={32} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>認識EventCat</div>
          <div>關於EventCat</div>
          <div>EventCat旅遊雜誌 (香港)</div>
          <div>加入我們</div>
          <div>EventCat禮品卡</div>
          <div>媒體新聞</div>
          <div>永續發展</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>合作夥伴</div>
          <div>商戶註冊</div>
          <div>商戶登入</div>
          <div>聯合行銷</div>
          <div>名人合作</div>
          <div>同業交易</div>
          <div>與 EventCat 合作</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>網站條款</div>
          <div>使用條款</div>
          <div>私隱政策</div>
          <div>Cookie政策</div>
          <div>漏洞獎金計劃</div>
          <div>動物福利政策</div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>支付方式</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {paymentIcons.map((icon, idx) => (
              <img key={idx} src={icon} alt="pay" style={{ height: 28, marginRight: 8, marginBottom: 8 }} />
            ))}
          </div>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ borderTop: '1px solid #eee', padding: '24px 0 12px 0' }}>
        <Col xs={24} md={12} style={{ color: '#888', fontSize: 14 }}>
          © 2024-{new Date().getFullYear()} EventCat. All Rights Reserved.
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right', fontSize: 22 }}>
          <a href="#" style={{ color: '#222', marginRight: 16 }}><FacebookFilled /></a>
          <a href="#" style={{ color: '#222', marginRight: 16 }}><YoutubeFilled /></a>
          <a href="#" style={{ color: '#222', marginRight: 16 }}><InstagramFilled /></a>
        </Col>
      </Row>
    </div>
  </footer>
);

export default Footer; 