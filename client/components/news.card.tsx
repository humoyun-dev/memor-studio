import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface NewsCardProps {
  id: number;
  slug: string;
  title: string;
  date: string;
  cover_url: string;
  tags: string[];
}

export function NewsCard({
  id,
  slug,
  title,
  date,
  cover_url,
  tags,
}: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={cover_url || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold text-balance group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <time dateTime={date}>{formattedDate}</time>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
