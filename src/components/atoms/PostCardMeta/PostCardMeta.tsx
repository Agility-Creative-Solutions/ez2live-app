import React, { FC } from "react";
import Avatar from "@/components/atoms/Avatar/Avatar";
import { _getPersonNameRd } from "@/contains/fakeData";
import Link from "next/link";

export interface PostCardMetaProps {
  className?: string;
  hiddenAvatar?: boolean;
}

const PostCardMeta: FC<PostCardMetaProps> = ({
  className = "leading-none",
  hiddenAvatar = false,
}) => {
  return (
    <div
      className={`nc-PostCardMeta inline-flex items-center fledx-wrap text-neutral-800  text-sm ${className}`}
      data-nc-id="PostCardMeta"
    >
      <Link
        href={"/"}
        className="flex-shrink-0 relative flex items-center space-x-2"
      >
        {!hiddenAvatar && (
          <Avatar radius="rounded-full" sizeClass={"h-7 w-7 text-sm"} />
        )}
        <span className="block text-neutral-6000 hover:text-black   font-medium">
          {_getPersonNameRd()}
        </span>
      </Link>
      <>
        <span className="text-neutral-500  mx-[6px] font-medium">·</span>
        <span className="text-neutral-500  font-normal line-clamp-1">
          May 20, 2021
        </span>
      </>
    </div>
  );
};

export default PostCardMeta;