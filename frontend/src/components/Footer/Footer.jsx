import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <div className='footer' id='footer' >
        <div className='footer-content' >
<div className='footer-content-left'>
<img src={assets.logo} alt="" />
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus aspernatur mollitia impedit dignissimos inventore quaerat corporis reiciendis animi. Magnam cum consequatur error necessitatibus harum dolorem illo nihil autem consectetur rem!</p>
<div className='footer-social-icon'>
    <img src={assets.facebook_icon} alt="" />
       <img src={assets.twitter_icon} alt="" />
          <img src={assets.linkedin_icon} alt="" />

</div>
</div >
<div className='footer-contant-center'>
<h2>COMPANY</h2>
<ul>
    <li> Home</li>
    <li> About us</li>
    <li> Deliveru</li>
    <li>privicy policy</li>
    
</ul>
</div>


<div className='footer-content-right'>
<h2>
    GET IN TOUCH
</h2>
<ul>
    <li>+1-123-11232</li>
    <li>contac@gmail.com</li>
</ul>
</div>

        </div>
        <hr />
        <p className='footer-copyright'>
            copyright 2026 All Right Resived
        </p>
      
    </div>
  )
}

export default Footer
