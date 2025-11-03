import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Edit from "components/driversManagement/Edit";

export default function EditDriver() {
  const router = useRouter();
  const { id } = router.query;

  return <Edit model={false} id={id} />;
}

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main","driversManagement"])),
    },
  };
}
// translation ##################################
