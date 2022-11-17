
import './Avatar.css';

const Avatar = (props) => {
  const { name , content , img } = props;
  return(
    <>
      <div className='card-body'>
        <div className='character'>
          <img style={{width:'150px'}} src={img} alt='avatar' />
        </div>
        <div className='angle'>
          <img  src='./assets/img/Triangle.png' alt='angle' />
          <div className='member-title'>
            <div className='nftName textStroke'>{name}</div>
            <div className='nftContent textStroke'>{content}</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Avatar;