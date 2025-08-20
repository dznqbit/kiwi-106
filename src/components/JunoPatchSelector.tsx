import { Button, Group } from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { JunoButtonGroup } from "./JunoButtonGroup";
import { SevenSegmentDisplay } from "./SevenSegmentDisplay";

export const JunoPatchSelector = () => {
  const kiwi106Context = useKiwi106Context();

  return (
    <Group>
      <JunoButtonGroup>
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />

        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
      </JunoButtonGroup>

      <SevenSegmentDisplay value={18} size={40} />

      <JunoButtonGroup>
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />

        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
        <Button variant="juno" color="blue" size="lg" />
      </JunoButtonGroup>
    </Group>
  );
};
