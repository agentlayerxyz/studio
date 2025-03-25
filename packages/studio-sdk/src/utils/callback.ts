import { verifyMessage } from "viem";

export async function verifySignature({
  signature,
  payload,
  walletAddress,
  timestampTolerance = 1000 * 60 * 1, // 1 minutes
}: {
  signature: string | undefined;
  payload: Record<string, string> & { timestamp?: number };
  walletAddress: `0x${string}`;
  timestampTolerance?: number;
}): Promise<
  { verified: true; error?: never } | { verified: false; error: string }
> {
  if (!signature) {
    return {
      verified: false,
      error: "Signature is not provided",
    };
  }

  if (!payload.timestamp) {
    return {
      verified: false,
      error: "Timestamp is missing from payload",
    };
  }

  const { timestamp, ...payloadWithoutTimestamp } = payload;
  const now = Date.now();
  const timeDiff = now - timestamp;
  const timeDiffInSeconds = timeDiff / 1000;

  if (timeDiffInSeconds > timestampTolerance) {
    return {
      verified: false,
      error: "Timestamp is too old",
    };
  }

  const payloadString =
    Object.keys(payloadWithoutTimestamp)
      .sort()
      .map(
        (key) =>
          `${key}=${JSON.stringify(payloadWithoutTimestamp[key as keyof typeof payloadWithoutTimestamp])}`
      )
      .join("&") + `&timestamp=${timestamp}`;

  const verified = await verifyMessage({
    message: payloadString,
    signature: signature as `0x${string}`,
    address: walletAddress,
  });

  return verified
    ? { verified: true }
    : { verified: false, error: "Signature is invalid" };
}
