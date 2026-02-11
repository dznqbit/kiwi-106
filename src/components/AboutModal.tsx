import { Anchor, Modal, Stack, Group, Divider, Text } from "@mantine/core";

interface AboutModalProps {
  opened: boolean;
  onClose: () => void;
}

export const AboutModal = ({ opened, onClose }: AboutModalProps) => {
  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header px={0} pb={4}>
          <Stack gap="xs" style={{ width: "100%" }}>
            <Group px="md" style={{ width: "100%" }}>
              <Modal.Title>ABOUT</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Divider color="dark.0" size="xl" mx="md" />
          </Stack>
        </Modal.Header>
        <Modal.Body pt="md">
          <Stack>
            <Text>
              Do you have a Kiwi-106 and want to switch the LFO source for a
              param? Now you've got a web-based control surface.
            </Text>

            <Text>
              This is open-source software - code is hosted at{` `}
              <Anchor
                href="https://github.com/dznqbit/kiwi-106"
                target="_blank"
              >
                github.com/dznqbit/kiwi-106
              </Anchor>
              .
            </Text>
            <Text>
              Bug reports + feature request should be submitted to the{" "}
              <Anchor
                href="https://github.com/dznqbit/kiwi-106/issues/new"
                target="_blank"
                title="Github Issues"
              >
                Github Issues form
              </Anchor>
              . You're also welcome to fork this and modify it for your own needs.
            </Text>

            <Divider />

            <Text size="xs" c="dimmed">
              This software is provided "as is", without warranty of any kind,
              express or implied. The author assumes no responsibility or
              liability for any damage, data loss, or other issues arising from
              the use of this software. Use at your own risk.
            </Text>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
