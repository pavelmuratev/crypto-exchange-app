import Skeleton from "@mui/material/Skeleton";
import PropTypes from "prop-types";

function SkeletonTableLoader({ width, height }) {
  return (
    <Skeleton sx={{ height, width }} animation="wave" variant="rectangular" />
  );
}

SkeletonTableLoader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SkeletonTableLoader;
