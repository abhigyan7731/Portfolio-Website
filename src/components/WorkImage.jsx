const WorkImage = ({ image, alt }) => {
  return (
    <div className="work-image">
      <img src={image} alt={alt} />
    </div>
  );
};

export default WorkImage;
