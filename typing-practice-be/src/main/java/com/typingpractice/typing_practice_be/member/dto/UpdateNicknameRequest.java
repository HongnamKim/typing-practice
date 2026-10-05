package com.typingpractice.typing_practice_be.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class UpdateNicknameRequest {
  @NotNull
  @NotBlank
  @Pattern(regexp = "\\X{2,10}", message = "닉네임은 2-10자여야 합니다.")
  private String nickname;

  public static UpdateNicknameRequest create(String nickname) {
    UpdateNicknameRequest request = new UpdateNicknameRequest();

    request.nickname = nickname;

    return request;
  }
}
