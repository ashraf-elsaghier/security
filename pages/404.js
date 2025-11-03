import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

const PageNotFound = () => {
  return (
    <Image layout="fill" src="/404.svg" alt="" />
    
  );
};

export default PageNotFound;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}
// translation ##################################
