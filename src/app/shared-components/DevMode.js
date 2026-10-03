import { useSelector } from 'react-redux';

const DevMode = ({ children }) => {
  const { devMode } = useSelector((state) => state.devMode);

  if (!devMode) {
    return null;
  }

  return !children.$$typeof ? (
    <span className="text-red-900 backgr bg-white font-bold mr-8 text-center">{children}</span>
  ) : (
    children
  );
};

export default DevMode;
