import React from "react";
import useFetch from "@/lib/use-fetch";
import { MembersType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const TeamHero = () => {
  const { data, isLoading } = useFetch<{
    results: MembersType[];
    count: number;
  }>(`team/`);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {data?.results.map((member) => (
        <Card key={member.id}>
          <CardContent className="pt-6 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Image
                className={`aspect-square rounded-full`}
                src={member.photo_url}
                width={600}
                height={600}
                alt={member.name}
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 capitalize">
              {member.name}
            </h3>
            <p className="text-muted-foreground mb-4 uppercase">
              {member.role}
            </p>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: member.bio ?? "" }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamHero;
