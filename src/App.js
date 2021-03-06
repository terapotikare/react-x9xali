import React, { useState, createRef, useEffect } from 'react';
import './style.scss';
import {
  ReplyIcon,
  RetweetIcon,
  LikeIcon,
  ShareIcon,
  VerifiedIcon,
} from './icons';
import { AvatarLoader } from './loaders';
import { useScreenshot } from 'use-react-screenshot';
import { language} from './language';
function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContent('2d');
  var image = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}
const tweetFormat = (tweet) => {
  tweet = tweet
    .replace(/@([\w]+)/g, '<span>@$1</span>')
    .replace(/#([\wşçöüğüıİ]+)/gi, '<span>#$1</span>')
    .replace(/(https?:\/\/[\w\.\/]+)/, '<span></span>');
  return tweet;
};
const formatNumber = (number) => {
  if (!number) {
    number = 0;
  }
  if (number < 1000) {
    return number;
  }
  number /= 1000;
  number = String(number).split('.');
  return (
    number[0] + (number[1] > 100 ? ',' + number[1].slice(0, 1) + 'B' : 'B')
  );
};

export default function App() {
  const tweetRef = createRef(null);
  const downloadRef = createRef();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isVerified, setİsVerified] = useState(0);
  const [tweet, setTweet] = useState();
  const [avatar, setAvatar] = useState();
  const [retweet, setRetweet] = useState(0);
  const [quoteTweets, setQuoteTweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [lang, setLang] = useState('tr');
  const [image, takeScreenshot] = useScreenshot();
  const[langText,setLangText]=useState()
  const getImage = () => takeScreenshot(tweetRef.current);
 useEffect(()=>{
  setLangText(language[lang]);
 },[lang])
  useEffect(() => {
    if (image) {
      downloadRef.current.click();
    }
    console.log(image);
  }, [image]);
  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      setAvatar(this.result);
    });
    reader.readAsDataURL(file);
  };
  const fetchTwitterInfo = () => {
    fetch(
      `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`
    )
      .then((res) => res.json())
      .then((data) => {
        const twitter = data[0];
        console.log(twitter);

        convertImgToBase64(
          twitter.profile_image_url_https,
          function (base64Image) {
            setAvatar(base64Image);
          }
        );
        setName(twitter.name);
        setUsername(twitter.screen_name);
        setTweet(twitter.status.text);
        setRetweet(twitter.status.retweet_count);
        setLikes(twitter.status.favorite_count);
      });
  };
  return (
    <>
      <div className="tweet-settings">
        <h3>{langText?.settings}</h3>
        <ul>
          <li>
            <label>Ad Soyad</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>Tweet</label>
            <textarea
              input
              type="number"
              class="textarea"
              maxLenght="290"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />
          </li>
          <li>
            <label>Avatar</label>
            <input type="file" className="input" onChange={avatarHandle} />
          </li>
          <li>
            <label>Retweet</label>
            <input
              type="number"
              className="input"
              value={retweet}
              onChange={(e) => setRetweet(e.target.value)}
            />
          </li>
          <li>
            <label>Alıntılanan Tweet</label>
            <input
              type="text"
              className="input"
              value={quoteTweets}
              onChange={(e) => setQuoteTweets(e.target.value)}
            />
          </li>
          <li>
            <label>Beğeni</label>
            <input
              type="text"
              className="input"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
            />
          </li>
          <li>
            <label>Doğrulanmış Hesap</label>
            <select
              onChange={(e) => setİsVerified(e.target.value)}
              defaultValue={isVerified}
            >
              <option value="1">Evet</option>
              <option value="0">Hayır</option>
            </select>
          </li>
          <button onClick={getImage}>Oluştur</button>
          <div className="download-url">
            {image && (
              <a ref={downloadRef} href={image} download="tweet.png">
                Tweeti İndir
              </a>
            )}
          </div>
        </ul>
      </div>
      <div className="tweet-container">
        <div className="app-language">
          <span onClick={()=>setLang('tr')}className={lang === 'tr' && 'active'}>Türkçe</span>
          <span onClick={()=>setLang('en')} className={lang === 'en' && 'active'}>English</span>
        </div>
        <div className="fetch-info">
          <input
            type="text"
            value={username}
            placeholder="Twitter kullanıcı adını yazınız"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchTwitterInfo}>Bilgileri Çek </button>
        </div>

        <div className="tweet" ref={tweetRef}>
          <div className="tweet-author">
            {(avatar && <img src={avatar} />) || <AvatarLoader />}
            <div>
              <div className="name">
                {name || 'Ad Soyad'}
                {isVerified == 1 && <VerifiedIcon width="19" height="19" />}
              </div>
              <div className="username">@{username || 'kullaniciadi'}</div>
            </div>
          </div>
          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (tweet && tweetFormat(tweet)) ||
                  'Bu alana örnek tweet gelecek',
              }}
            ></p>
          </div>
          <div className="tweet-stats">
            <span>
              <b>{formatNumber(retweet)}</b> Retweet
            </span>
            <span>
              <b>{formatNumber(quoteTweets)}</b>Alıntı Tweetler
            </span>
            <span>
              <b>{formatNumber(likes)}</b> Beğeni
            </span>
          </div>
          <div className="tweet-actions">
            <span>
              <ReplyIcon />
            </span>
            <span>
              <RetweetIcon />
            </span>
            <span>
              <LikeIcon />
            </span>
            <span>
              <ShareIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
