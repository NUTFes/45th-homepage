"use client"
import React, { use } from "react";
import {Link} from "react-aria-components";
import { Button } from "../aria/Button";

export default function ButtonMain(props: { href: string ,title: string }) {
    const { href, title } = props;
    return (
<Button className=" w-fit h-fit button-gradient rounded-full border-2 border-main">
<Link
    href={href}
  className="font-sans text-white text-button px-l py-s"
>
  {title}
</Link>
</Button>
    );
}
        