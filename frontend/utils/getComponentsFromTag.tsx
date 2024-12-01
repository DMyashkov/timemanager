import React from "react";
import Tag from "@components/tag/tagComponent";
import { dataIndex } from "@constants/exampleData";
import { moduleType } from "@interfaces";
import { useTheme } from "@context/ThemeContext";

export const TagsFromId = ({
  tagId,
  desiredHeight,
  fontSize,
}: {
  tagId: string;
  desiredHeight?: number;
  fontSize?: number;
}) => {
  const { theme } = useTheme();
  const isTagProject = dataIndex[tagId].item.type === moduleType.project;

  const parentId = dataIndex[tagId].path.at(-1);
  const itemActivity = isTagProject
    ? parentId
      ? dataIndex[parentId].item
      : null
    : dataIndex[tagId].item;
  const itemProject = isTagProject ? dataIndex[tagId].item : null;

  return (
    <>
      {itemActivity && (
        <Tag
          text={itemActivity.title}
          colorPallete={theme.color.presets[itemActivity.colorPreset]}
          {...(desiredHeight != null && { desiredHeight })}
          {...(fontSize != null && { textSize: fontSize })}
        />
      )}
      {itemProject && (
        <Tag
          text={itemProject.title}
          isProject={true}
          colorPallete={theme.color.presets[itemProject.colorPreset]}
          {...(desiredHeight != null && { desiredHeight })}
          {...(fontSize != null && { textSize: fontSize })}
        />
      )}
    </>
  );
};
