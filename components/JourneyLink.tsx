import { Text, Link } from "@chakra-ui/react";

export default function JourneyLink() {
    return (
        <Text mt={2} fontSize="sm" textAlign="center">
            <Link
                href="https://www.fakemayo.com/p/how-franco-grew-his-sports-job-board-to-300-mrr?utm_source=sportsjobsonline"
                color="gray.400"
                isExternal
            >
                My journey to build sportsjobs.online
            </Link>
        </Text>
    );
}
