const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} HybridWheels. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;