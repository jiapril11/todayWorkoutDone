import React from "react";
import Layout from "./Layout";

export default function Footer() {
  return (
    <footer className="py-12 bg-neutral-950 text-lime-700">
      <Layout>
        <p className="uppercase text-sm">
          copyright &copy; 2023 all right reserved.
        </p>
      </Layout>
    </footer>
  );
}
