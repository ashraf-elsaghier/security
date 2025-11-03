import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/client";
import TrackTable from "components/track-sheet/TrackTable";

const Index = () => {
  return (
    <section className=" mt-5 mt-lg-1">
      <TrackTable />
    </section>
  );
};
export default Index;
// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session?.user?.user?.role == "support") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "main",
        "common",
        "Table",
      ])),
    },
  };
}
