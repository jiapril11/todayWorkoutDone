import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../api/user";

export default function Main() {
  const { isLoading, isError, data } = useQuery({
    queryKey: "users",
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  return <div>main</div>;
}
