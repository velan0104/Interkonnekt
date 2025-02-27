"use client";
import { IPoll } from "@/models/CommunityPost.model";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PollCardProps {
  poll: IPoll;
  standalone?: boolean;
}

export function PollCard({ poll, standalone = false }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const handleVote = (index: number) => {
    if (!hasVoted) {
      setSelectedOption(index);
      setHasVoted(true);
      // Add your API call here to update votes
    }
  };

  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className={standalone ? "w-full max-w-2xl mx-auto" : ""}>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">{poll.question}</h3>
        <p className="text-sm text-muted-foreground">
          Ends{" "}
          {formatDistanceToNow(new Date(poll.endDate), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option, index) => {
          const percentage = getVotePercentage(option.votes);
          const isSelected = selectedOption === index;

          return (
            <div key={index} className="space-y-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleVote(index)}
                disabled={hasVoted && !isSelected}
              >
                {option.text}
              </Button>
              {hasVoted && (
                <div className="space-y-1">
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {option.votes} votes
                    </span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <p className="text-sm text-muted-foreground text-center">
          {totalVotes} total votes
        </p>
      </CardContent>
    </Card>
  );
}
